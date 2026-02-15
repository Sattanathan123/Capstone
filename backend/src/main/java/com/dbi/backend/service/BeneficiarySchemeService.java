package com.dbi.backend.service;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.SchemeRepository;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeneficiarySchemeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchemeRepository schemeRepository;
    
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
        // Check income eligibility
        if (user.getAnnualIncome() == null) {
            return false;
        }
        boolean incomeEligible = user.getAnnualIncome() >= scheme.getMinIncome() 
                                && user.getAnnualIncome() <= scheme.getMaxIncome();
        
        // Check community eligibility
        boolean communityEligible = scheme.getCommunity().equalsIgnoreCase(user.getCasteCategory())
                                   || scheme.getCommunity().equalsIgnoreCase("OTHERS")
                                   || scheme.getCommunity().equalsIgnoreCase("ALL");
        
        // Check occupation eligibility
        boolean occupationEligible = scheme.getOccupation().equalsIgnoreCase(user.getIncomeSource())
                                    || scheme.getOccupation().equalsIgnoreCase("Others")
                                    || scheme.getOccupation().equalsIgnoreCase("ALL");
        
        // Scheme must be active
        boolean isActive = "ACTIVE".equalsIgnoreCase(scheme.getStatus());
        
        return incomeEligible && communityEligible && occupationEligible && isActive;
    }
    
    public void applyForScheme(Long userId, Long schemeId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        
        Scheme scheme = schemeRepository.findById(schemeId)
            .orElseThrow(() -> new Exception("Scheme not found"));
        
        // Verify eligibility before applying
        if (!isEligible(user, scheme)) {
            throw new Exception("You are not eligible for this scheme");
        }
        
        // TODO: Create application record in database
        // For now, just validate eligibility
        System.out.println("Application submitted for user: " + user.getId() + " scheme: " + scheme.getId());
    }
}
