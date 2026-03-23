package com.dbi.backend.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dbi.backend.entity.Application;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.UserRepository;

@Service
public class SmartValidationEngine {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public ValidationResult validateApplication(User user, Scheme scheme, Long applicationId) {
        Application app = applicationRepository.findById(applicationId).orElse(null);
        return validateApplication(user, scheme, applicationId, app);
    }

    public ValidationResult validateApplication(User user, Scheme scheme, Long applicationId, Application application) {
        ValidationResult result = new ValidationResult();
        result.setApplicationId(applicationId);
        boolean fieldsPassed = validateRequiredFields(user, result);
        boolean eligibilityPassed = checkEligibility(user, scheme, result);
        boolean incomePassed = verifyIncomeThreshold(user, scheme, result);
        boolean aadhaarVerified = verifyAadhaar(user, result);
        boolean docsPassed = validateDocuments(scheme, application, result);
        boolean windowPassed = validateApplicationWindow(scheme, result);
        result.setOverallStatus(fieldsPassed && eligibilityPassed && incomePassed && aadhaarVerified && docsPassed && windowPassed);
        
        String appId = (application != null && application.getApplicationId() != null)
            ? application.getApplicationId() : String.valueOf(applicationId);
        
        if (result.isOverallStatus()) {
            result.setMessage("✅ ELIGIBLE - Application passed all validation checks. Forwarding to Field Verification Officer.");
            result.setNextStatus("PENDING_VERIFICATION");
            notificationService.createNotification(user.getId(), 
                "Your application " + appId + " for " + scheme.getSchemeName() + " has been approved and is under review.", 
                "SUCCESS", applicationId);
        } else {
            result.setMessage("❌ NOT ELIGIBLE - Application failed validation checks. Please review the details below.");
            result.setNextStatus("REJECTED");
            notificationService.createNotification(user.getId(), 
                "Your application " + appId + " for " + scheme.getSchemeName() + " has been rejected. Please check the details.", 
                "REJECTED", applicationId);
        }
        return result;
    }
    
    private boolean checkEligibility(User user, Scheme scheme, ValidationResult result) {
        String community = scheme.getCommunity() != null ? scheme.getCommunity() : "ALL";
        String occupation = scheme.getOccupation() != null ? scheme.getOccupation() : "ALL";
        String userCaste = user.getCasteCategory() != null ? user.getCasteCategory() : "";
        String userOccupation = user.getIncomeSource() != null ? user.getIncomeSource() : "";

        boolean communityMatch = community.equalsIgnoreCase("ALL") || community.equalsIgnoreCase(userCaste);
        boolean occupationMatch = occupation.equalsIgnoreCase("ALL") ||
                                  occupation.equalsIgnoreCase(userOccupation) ||
                                  (occupation.toUpperCase().contains("AGRI") && userOccupation.toUpperCase().contains("AGRI"));

        boolean eligible = communityMatch && occupationMatch;
        result.addCheck("Eligibility Check", eligible,
            eligible ? "Community and occupation criteria met" :
                      "Community or occupation does not match scheme requirements");
        return eligible;
    }
    
    private boolean verifyIncomeThreshold(User user, Scheme scheme, ValidationResult result) {
        if (user.getAnnualIncome() == null) {
            result.addCheck("Income Verification", false, "Annual income not provided");
            return false;
        }
        
        boolean withinRange = user.getAnnualIncome() >= scheme.getMinIncome() && 
                             user.getAnnualIncome() <= scheme.getMaxIncome();
        
        result.addCheck("Income Threshold", withinRange,
            withinRange ? String.format("Income ₹%,.0f is within range ₹%,.0f - ₹%,.0f", 
                                       user.getAnnualIncome(), scheme.getMinIncome(), scheme.getMaxIncome()) :
                         String.format("Income ₹%,.0f is outside range ₹%,.0f - ₹%,.0f", 
                                       user.getAnnualIncome(), scheme.getMinIncome(), scheme.getMaxIncome()));
        
        return withinRange;
    }
    
    private boolean verifyAadhaar(User user, ValidationResult result) {
        boolean hasAadhaar = user.getAadhaarNumberHash() != null && 
                            !user.getAadhaarNumberHash().isEmpty();
        
        result.addCheck("Aadhaar Verification", hasAadhaar,
            hasAadhaar ? "Aadhaar verified and linked" : "Aadhaar not found or invalid");
        
        return hasAadhaar;
    }

    private boolean validateRequiredFields(User user, ValidationResult result) {
        StringBuilder missing = new StringBuilder();
        if (user.getFullName() == null || user.getFullName().isBlank()) missing.append("Full Name, ");
        if (user.getMobileNumber() == null || user.getMobileNumber().isBlank()) missing.append("Mobile Number, ");
        if (user.getAddress() == null || user.getAddress().isBlank()) missing.append("Address, ");
        if (user.getPincode() == null || user.getPincode().isBlank()) missing.append("Pincode, ");
        if (user.getCasteCategory() == null || user.getCasteCategory().isBlank()) missing.append("Caste Category, ");
        if (user.getAnnualIncome() == null) missing.append("Annual Income, ");
        if (user.getIncomeSource() == null || user.getIncomeSource().isBlank()) missing.append("Income Source, ");
        if (user.getDateOfBirth() == null) missing.append("Date of Birth, ");

        boolean passed = missing.length() == 0;
        result.addCheck("Required Fields", passed,
            passed ? "All required profile fields are present" :
                     "Missing fields: " + missing.toString().replaceAll(", $", ""));
        return passed;
    }

    private boolean validateDocuments(Scheme scheme, Application application, ValidationResult result) {
        if (application == null) {
            result.addCheck("Document Validation", false, "Application documents not found");
            return false;
        }
        StringBuilder missing = new StringBuilder();
        if (Boolean.TRUE.equals(scheme.getRequiresAadhaar()) &&
                (application.getAadhaarDoc() == null || application.getAadhaarDoc().isBlank()))
            missing.append("Aadhaar Card, ");
        if (Boolean.TRUE.equals(scheme.getRequiresIncomeCertificate()) &&
                (application.getIncomeCertDoc() == null || application.getIncomeCertDoc().isBlank()))
            missing.append("Income Certificate, ");
        if (Boolean.TRUE.equals(scheme.getRequiresCommunityCertificate()) &&
                (application.getCommunityCertDoc() == null || application.getCommunityCertDoc().isBlank()))
            missing.append("Community Certificate, ");
        if (Boolean.TRUE.equals(scheme.getRequiresOccupationProof()) &&
                (application.getOccupationProofDoc() == null || application.getOccupationProofDoc().isBlank()))
            missing.append("Occupation Proof, ");

        boolean passed = missing.length() == 0;
        result.addCheck("Document Validation", passed,
            passed ? "All required documents uploaded" :
                     "Missing documents: " + missing.toString().replaceAll(", $", ""));
        return passed;
    }

    private boolean validateApplicationWindow(Scheme scheme, ValidationResult result) {
        if (scheme.getApplicationStartDate() == null || scheme.getApplicationEndDate() == null) {
            result.addCheck("Application Window", true, "No date restriction for this scheme");
            return true;
        }
        LocalDate today = LocalDate.now();
        boolean open = !today.isBefore(scheme.getApplicationStartDate()) && !today.isAfter(scheme.getApplicationEndDate());
        result.addCheck("Application Window", open,
            open ? "Application is within the valid period" :
                   "Applications accepted only from " + scheme.getApplicationStartDate() + " to " + scheme.getApplicationEndDate());
        return open;
    }
    
    public static class ValidationResult {
        private Long applicationId;
        private String generatedApplicationId;
        private boolean overallStatus;
        private String message;
        private String nextStatus;
        private java.util.List<ValidationCheck> checks = new java.util.ArrayList<>();
        
        public void addCheck(String checkName, boolean passed, String details) {
            checks.add(new ValidationCheck(checkName, passed, details));
        }
        
        public Long getApplicationId() { return applicationId; }
        public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
        public String getGeneratedApplicationId() { return generatedApplicationId; }
        public void setGeneratedApplicationId(String generatedApplicationId) { this.generatedApplicationId = generatedApplicationId; }
        public boolean isOverallStatus() { return overallStatus; }
        public void setOverallStatus(boolean overallStatus) { this.overallStatus = overallStatus; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getNextStatus() { return nextStatus; }
        public void setNextStatus(String nextStatus) { this.nextStatus = nextStatus; }
        public java.util.List<ValidationCheck> getChecks() { return checks; }
    }
    
    public static class ValidationCheck {
        private String checkName;
        private boolean passed;
        private String details;
        public ValidationCheck(String checkName, boolean passed, String details) {
            this.checkName = checkName;
            this.passed = passed;
            this.details = details;
        }
        public String getCheckName() { return checkName; }
        public boolean isPassed() { return passed; }
        public String getDetails() { return details; }
    }
}
