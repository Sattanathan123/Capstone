package com.dbi.backend.service;

import java.util.List;

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
        ValidationResult result = new ValidationResult();
        result.setApplicationId(applicationId);
        boolean eligibilityPassed = checkEligibility(user, scheme, result);
        boolean incomePassed = verifyIncomeThreshold(user, scheme, result);
        boolean aadhaarVerified = verifyAadhaar(user, result);
        result.setOverallStatus(eligibilityPassed && incomePassed && aadhaarVerified);
        
        Application app = applicationRepository.findById(applicationId).orElse(null);
        String appId = app != null && app.getApplicationId() != null ? app.getApplicationId() : String.valueOf(applicationId);
        
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
        boolean communityMatch = scheme.getCommunity().equalsIgnoreCase("ALL") || 
                                 scheme.getCommunity().equalsIgnoreCase(user.getCasteCategory());
        
        boolean occupationMatch = scheme.getOccupation().equalsIgnoreCase("ALL") || 
                                  scheme.getOccupation().equalsIgnoreCase(user.getIncomeSource()) ||
                                  (scheme.getOccupation().toUpperCase().contains("AGRI") && 
                                   user.getIncomeSource().toUpperCase().contains("AGRI"));
        
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
