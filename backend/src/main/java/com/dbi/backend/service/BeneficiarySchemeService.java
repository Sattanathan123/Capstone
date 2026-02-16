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

@Service
public class BeneficiarySchemeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchemeRepository schemeRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    public BeneficiaryEligibleSchemesDTO getEligibleSchemes(Long userId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        
        // Get all active schemes
        List<Scheme> allSchemes = schemeRepository.findByStatus("ACTIVE");
        
        // Filter schemes based on eligibility
        List<Scheme> eligibleSchemes = allSchemes.stream()
            .filter(scheme -> isEligible(user, scheme))
            .collect(Collectors.toList());
        
        // Create beneficiary profile DTO
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
        if (user.getAnnualIncome() == null) {
            return false;
        }
        
        boolean incomeEligible = user.getAnnualIncome() >= scheme.getMinIncome() 
                                && user.getAnnualIncome() <= scheme.getMaxIncome();
        
        String schemeCommunity = scheme.getCommunity().toUpperCase();
        String userCommunity = user.getCasteCategory().toUpperCase();
        boolean communityEligible = schemeCommunity.equals(userCommunity)
                                   || schemeCommunity.equals("OTHERS")
                                   || schemeCommunity.equals("ALL");
        
        String schemeOccupation = scheme.getOccupation().toUpperCase();
        String userOccupation = user.getIncomeSource().toUpperCase();
        boolean occupationEligible = schemeOccupation.equals(userOccupation)
                                    || schemeOccupation.equals("OTHERS")
                                    || schemeOccupation.equals("ALL")
                                    || schemeOccupation.contains("AGRICULTURE") && userOccupation.contains("AGRI");
        
        boolean isActive = "ACTIVE".equalsIgnoreCase(scheme.getStatus());
        
        return incomeEligible && communityEligible && occupationEligible && isActive;
    }
    
    public void applyForScheme(Long userId, Long schemeId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        
        Scheme scheme = schemeRepository.findById(schemeId)
            .orElseThrow(() -> new Exception("Scheme not found"));
        
        if (!isEligible(user, scheme)) {
            throw new Exception("You are not eligible for this scheme");
        }
        
        Application app = new Application();
        app.setUser(user);
        app.setScheme(scheme);
        app.setStatus("SUBMITTED");
        app.setAppliedDate(LocalDateTime.now());
        applicationRepository.save(app);
    }
    
    public List<ApplicationDTO> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId).stream()
            .map(app -> new ApplicationDTO(
                app.getId(),
                app.getScheme().getSchemeName(),
                app.getStatus(),
                app.getAppliedDate(),
                app.getRemarks()
            ))
            .collect(Collectors.toList());
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
}
