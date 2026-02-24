package com.dbi.backend.service;

import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SchemeMatchingService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public void notifyEligibleBeneficiaries(Scheme scheme) {
        List<User> beneficiaries = userRepository.findByRole(UserRole.BENEFICIARY);
        
        beneficiaries.stream()
            .filter(user -> isEligible(user, scheme))
            .forEach(user -> {
                String message = "New scheme available: " + scheme.getSchemeName() + 
                    ". You are eligible to apply. Income range: ₹" + scheme.getMinIncome() + 
                    " - ₹" + scheme.getMaxIncome();
                notificationService.createNotification(user.getId(), message, "NEW_SCHEME", null);
            });
    }
    
    private boolean isEligible(User user, Scheme scheme) {
        boolean communityMatch = "ALL".equalsIgnoreCase(scheme.getCommunity()) || 
            scheme.getCommunity().equalsIgnoreCase(user.getCasteCategory());
        
        boolean occupationMatch = "ALL".equalsIgnoreCase(scheme.getOccupation()) || 
            scheme.getOccupation().equalsIgnoreCase(user.getIncomeSource()) ||
            (scheme.getOccupation().toUpperCase().contains("AGRI") && 
             user.getIncomeSource() != null && user.getIncomeSource().toUpperCase().contains("AGRI"));
        
        boolean incomeMatch = user.getAnnualIncome() != null && 
            user.getAnnualIncome() >= scheme.getMinIncome() && 
            user.getAnnualIncome() <= scheme.getMaxIncome();
        
        return communityMatch && occupationMatch && incomeMatch;
    }
}
