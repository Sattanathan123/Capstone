package com.dbi.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
import com.dbi.backend.entity.Application;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.SchemeRepository;
import com.dbi.backend.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class BeneficiarySchemeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchemeRepository schemeRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private SmartValidationEngine validationEngine;
    
    @Autowired
    private ApplicationIdGenerator applicationIdGenerator;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PriorityCalculator priorityCalculator;

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @Autowired
    private EmailService emailService;
    
    public ApplicationRepository getApplicationRepository() {
        return applicationRepository;
    }
    
    @Cacheable(value = "eligibleSchemes", key = "#userId")
    public BeneficiaryEligibleSchemesDTO getEligibleSchemes(Long userId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        
        List<Scheme> allSchemes = schemeRepository.findByStatus("Active");
        if (allSchemes.isEmpty()) {
            allSchemes = schemeRepository.findAll();
        }
        
        List<Application> userApplications = applicationRepository.findByUserId(userId);
        List<Long> appliedSchemeIds = userApplications.stream()
            .filter(app -> !app.getStatus().equals("REJECTED"))
            .map(app -> app.getScheme().getId())
            .collect(Collectors.toList());
        
        List<Scheme> eligibleSchemes = allSchemes.stream()
            .filter(scheme -> isEligible(user, scheme) && !appliedSchemeIds.contains(scheme.getId()))
            .collect(Collectors.toList());
        
        BeneficiaryEligibleSchemesDTO.BeneficiaryProfileDTO profile = 
            new BeneficiaryEligibleSchemesDTO.BeneficiaryProfileDTO(
                user.getFullName(),
                user.getAnnualIncome(),
                user.getCasteCategory(),
                user.getIncomeSource()
            );
        
        return new BeneficiaryEligibleSchemesDTO(profile, eligibleSchemes);
    }
    
    private boolean isEligible(User user, Scheme scheme) {
        return true;
    }
    
    @CacheEvict(value = "eligibleSchemes", key = "#userId")
    @Transactional
    public SmartValidationEngine.ValidationResult applyForScheme(Long userId, Long schemeId, Map<String, String> documents) throws Exception {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));
        Scheme scheme = schemeRepository.findById(schemeId).orElseThrow(() -> new Exception("Scheme not found"));
        
        // Check for duplicate BEFORE saving
        List<Application> existingApps = applicationRepository.findByUserId(userId);
        boolean hasDuplicate = existingApps.stream()
            .anyMatch(app -> app.getScheme().getId().equals(schemeId) && 
                           !app.getStatus().equals("REJECTED"));
        
        if (hasDuplicate) {
            throw new Exception("You have already applied for this scheme. Duplicate applications are not allowed.");
        }
        
        // Update parent details if provided
        if (documents != null && documents.containsKey("parentDetails")) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> parentDetails = mapper.readValue(documents.get("parentDetails"), Map.class);
                
                if (parentDetails.containsKey("parentName")) user.setParentName((String) parentDetails.get("parentName"));
                if (parentDetails.containsKey("parentOccupation")) user.setParentOccupation((String) parentDetails.get("parentOccupation"));
                if (parentDetails.containsKey("parentIncome")) user.setParentIncome(Double.valueOf(parentDetails.get("parentIncome").toString()));
                if (parentDetails.containsKey("parentMobileNumber")) user.setParentMobileNumber((String) parentDetails.get("parentMobileNumber"));
                
                userRepository.save(user);
            } catch (Exception e) {
                System.err.println("Error parsing parent details: " + e.getMessage());
            }
        }
        
        Long maxId = applicationRepository.findMaxId() + 1;
        
        String generatedAppId = applicationIdGenerator.generateApplicationId(user.getState(), maxId);
        
        Application app = new Application();
        app.setApplicationId(generatedAppId);
        app.setUser(user);
        app.setScheme(scheme);
        app.setStatus("SUBMITTED");
        app.setAppliedDate(LocalDateTime.now());
        app.setPriority(priorityCalculator.calculate(user));
        
        // Save documents if provided
        if (documents != null) {
            if (documents.containsKey("aadhaarDoc")) {
                app.setAadhaarDoc(documents.get("aadhaarDoc"));
            }
            if (documents.containsKey("incomeCertDoc")) {
                app.setIncomeCertDoc(documents.get("incomeCertDoc"));
            }
            if (documents.containsKey("communityCertDoc")) {
                app.setCommunityCertDoc(documents.get("communityCertDoc"));
            }
            if (documents.containsKey("occupationProofDoc")) {
                app.setOccupationProofDoc(documents.get("occupationProofDoc"));
            }
        }
        
        Application saved = applicationRepository.save(app);

        // Fraud check — runs immediately after saving
        List<String> fraudReasons = fraudDetectionService.checkApplicationFraud(user);
        if (!fraudReasons.isEmpty()) {
            saved.setStatus("FRAUD");
            saved.setRemarks("Fraud detected: " + String.join("; ", fraudReasons));
            applicationRepository.save(saved);

            if (user.getEmail() != null && !user.getEmail().isBlank()) {
                emailService.sendEmail(
                    user.getEmail(),
                    "⚠️ Fraud Alert: Your Application " + generatedAppId + " Has Been Flagged",
                    "Dear " + user.getFullName() + ",\n\n" +
                    "Your application (ID: " + generatedAppId + ") for the scheme \"" +
                    scheme.getSchemeName() + "\" has been flagged as potentially fraudulent.\n\n" +
                    "Reason(s):\n" + fraudReasons.stream()
                        .map(r -> "  - " + r)
                        .collect(java.util.stream.Collectors.joining("\n")) + "\n\n" +
                    "Your application will not be processed further. " +
                    "If you believe this is an error, please contact your district office.\n\n" +
                    "Regards,\nDBI Scheme Management System"
                );
            }

            SmartValidationEngine.ValidationResult fraudResult = new SmartValidationEngine.ValidationResult();
            fraudResult.setGeneratedApplicationId(generatedAppId);
            fraudResult.setNextStatus("FRAUD");
            fraudResult.setMessage("Application flagged as fraudulent: " + String.join("; ", fraudReasons));
            return fraudResult;
        }
        
        SmartValidationEngine.ValidationResult result = validationEngine.validateApplication(user, scheme, saved.getId(), saved);
        result.setGeneratedApplicationId(generatedAppId);
        
        saved.setStatus(result.getNextStatus());
        saved.setRemarks(result.getMessage());
        applicationRepository.save(saved);
        
        // Notify beneficiary
        notificationService.createNotification(
            userId,
            "Your application for " + scheme.getSchemeName() + " has been submitted successfully. Application ID: " + generatedAppId + ". Your application will be reviewed by the field verification officer of " + user.getDistrict() + " district.",
            "APPLICATION_SUBMITTED",
            saved.getId()
        );

        // Stage 1 — email field officer(s) of the same district
        List<com.dbi.backend.entity.User> officers = userRepository
            .findByRoleAndAssignedDistrict(com.dbi.backend.entity.UserRole.FIELD_VERIFICATION_OFFICER, user.getDistrict());
        for (com.dbi.backend.entity.User officer : officers) {
            if (officer.getEmail() != null && !officer.getEmail().isBlank()) {
                emailService.sendVerificationRequestEmail(
                    officer.getEmail(), officer.getFullName(),
                    generatedAppId, scheme.getSchemeName(),
                    user.getFullName(), user.getDistrict()
                );
            }
        }
        
        return result;
    }
    
    public List<ApplicationDTO> getUserApplications(Long userId) {
        try {
            System.out.println("Fetching applications for user: " + userId);
            List<Application> apps = applicationRepository.findByUserId(userId);
            System.out.println("Found " + apps.size() + " applications");
            
            return apps.stream()
                .map(app -> {
                    try {
                        String schemeName = app.getScheme() != null ? app.getScheme().getSchemeName() : "Unknown";
                        return new ApplicationDTO(
                            app.getId(),
                            app.getApplicationId(),
                            schemeName,
                            app.getStatus(),
                            app.getAppliedDate(),
                            app.getRemarks()
                        );
                    } catch (Exception e) {
                        System.err.println("Error mapping application: " + e.getMessage());
                        return null;
                    }
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching applications: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }
    
    public static class ApplicationDTO {
        public Long id;
        public String applicationId;
        public String schemeName;
        public String status;
        public LocalDateTime appliedDate;
        public String remarks;
        
        public ApplicationDTO(Long id, String applicationId, String schemeName, String status, LocalDateTime appliedDate, String remarks) {
            this.id = id;
            this.applicationId = applicationId;
            this.schemeName = schemeName;
            this.status = status;
            this.appliedDate = appliedDate;
            this.remarks = remarks;
        }
    }
}
