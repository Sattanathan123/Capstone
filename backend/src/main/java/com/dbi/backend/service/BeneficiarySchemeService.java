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
            .map(app -> app.getScheme().getId())
            .collect(Collectors.toList());
        
        System.out.println("Total schemes: " + allSchemes.size() + ", Applied: " + appliedSchemeIds);
        
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
    public void applyForScheme(Long userId, Long schemeId) throws Exception {
        System.out.println("=== APPLY FOR SCHEME ===");
        System.out.println("User ID: " + userId + ", Scheme ID: " + schemeId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        System.out.println("User found: " + user.getFullName());
        
        Scheme scheme = schemeRepository.findById(schemeId)
            .orElseThrow(() -> new Exception("Scheme not found"));
        System.out.println("Scheme found: " + scheme.getSchemeName());
        
        List<Application> existingApps = applicationRepository.findByUserId(userId);
        boolean alreadyApplied = existingApps.stream()
            .anyMatch(app -> app.getScheme().getId().equals(schemeId));
        
        if (alreadyApplied) {
            System.out.println("Already applied!");
            throw new Exception("You have already applied for this scheme");
        }
        
        Application app = new Application();
        app.setUser(user);
        app.setScheme(scheme);
        app.setStatus("SUBMITTED");
        app.setAppliedDate(LocalDateTime.now());
        
        Application saved = applicationRepository.save(app);
        applicationRepository.flush();
        
        System.out.println("Application SAVED with ID: " + saved.getId());
        System.out.println("========================");
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
        public String schemeName;
        public String status;
        public LocalDateTime appliedDate;
        public String remarks;
        
        public ApplicationDTO(Long id, String schemeName, String status, LocalDateTime appliedDate, String remarks) {
            this.id = id;
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
