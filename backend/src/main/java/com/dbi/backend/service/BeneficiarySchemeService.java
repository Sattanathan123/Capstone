package com.dbi.backend.service;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.User;
import com.dbi.backend.entity.Application;
import com.dbi.backend.repository.SchemeRepository;
import com.dbi.backend.repository.UserRepository;
import com.dbi.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

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
    
    public ApplicationRepository getApplicationRepository() {
        return applicationRepository;
    }
    
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
        
        System.out.println("Total schemes: " + allSchemes.size() + ", Applied (non-rejected): " + appliedSchemeIds);
        
        List<Scheme> eligibleSchemes = allSchemes.stream()
            .filter(scheme -> isEligible(user, scheme) && !appliedSchemeIds.contains(scheme.getId()))
            .collect(Collectors.toList());
        
        System.out.println("Eligible schemes: " + eligibleSchemes.size());
        
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
        
        Long maxId = applicationRepository.findAll().stream()
            .map(Application::getId)
            .max(Long::compareTo)
            .orElse(0L) + 1;
        
        String generatedAppId = applicationIdGenerator.generateApplicationId(user.getState(), maxId);
        
        Application app = new Application();
        app.setApplicationId(generatedAppId);
        app.setUser(user);
        app.setScheme(scheme);
        app.setStatus("SUBMITTED");
        app.setAppliedDate(LocalDateTime.now());
        
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
        
        SmartValidationEngine.ValidationResult result = validationEngine.validateApplication(user, scheme, saved.getId());
        result.setGeneratedApplicationId(generatedAppId);
        
        saved.setStatus(result.getNextStatus());
        saved.setRemarks(result.getMessage());
        applicationRepository.save(saved);
        
        // Send email notification
        notificationService.createNotification(
            userId,
            "Your application for " + scheme.getSchemeName() + " has been submitted successfully. Application ID: " + generatedAppId + ". Your application will be reviewed by the field verification officer of " + user.getDistrict() + " district.",
            "APPLICATION_SUBMITTED",
            saved.getId()
        );
        
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
    
    public String debugEligibility(Long userId) throws Exception {
        User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));
        List<Scheme> allSchemes = schemeRepository.findAll();
        
        StringBuilder debug = new StringBuilder();
        debug.append("User: ").append(user.getFullName()).append("\n");
        debug.append("Income: ").append(user.getAnnualIncome()).append("\n");
        debug.append("Community: ").append(user.getCasteCategory()).append("\n");
        debug.append("Occupation: ").append(user.getIncomeSource()).append("\n\n");
        debug.append("Total schemes in DB: ").append(allSchemes.size()).append("\n\n");
        
        for (Scheme scheme : allSchemes) {
            debug.append("Scheme: ").append(scheme.getSchemeName()).append("\n");
            debug.append("  Status: ").append(scheme.getStatus()).append("\n");
            debug.append("  Income: ").append(scheme.getMinIncome()).append("-").append(scheme.getMaxIncome()).append("\n");
            debug.append("  Community: ").append(scheme.getCommunity()).append("\n");
            debug.append("  Occupation: ").append(scheme.getOccupation()).append("\n");
            debug.append("  Eligible: ").append(isEligible(user, scheme)).append("\n\n");
        }
        
        return debug.toString();
    }
}
