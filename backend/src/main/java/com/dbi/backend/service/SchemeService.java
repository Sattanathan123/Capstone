package com.dbi.backend.service;

import com.dbi.backend.dto.SchemeDTO;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class SchemeService {
    
    @Autowired
    private SchemeRepository schemeRepository;
    
    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }
    
    public Scheme createScheme(SchemeDTO dto) throws Exception {
        // Validate mandatory fields
        if (dto.getMinIncome() == null || dto.getMaxIncome() == null) {
            throw new Exception("Income range is required");
        }
        if (dto.getCommunity() == null || dto.getCommunity().isEmpty()) {
            throw new Exception("Community is required");
        }
        if (dto.getOccupation() == null || dto.getOccupation().isEmpty()) {
            throw new Exception("Occupation is required");
        }
        
        Scheme scheme = new Scheme();
        scheme.setSchemeName(dto.getSchemeName());
        scheme.setSchemeDescription(dto.getSchemeDescription());
        scheme.setSchemeComponent(dto.getSchemeComponent());
        scheme.setStatus(dto.getStatus());
        scheme.setMinIncome(dto.getMinIncome());
        scheme.setMaxIncome(dto.getMaxIncome());
        scheme.setCommunity(dto.getCommunity());
        scheme.setOccupation(dto.getOccupation());
        scheme.setBenefitType(dto.getBenefitType());
        scheme.setMaxBenefitAmount(dto.getMaxBenefitAmount());
        scheme.setApplicationStartDate(LocalDate.parse(dto.getApplicationStartDate()));
        scheme.setApplicationEndDate(LocalDate.parse(dto.getApplicationEndDate()));
        scheme.setRequiresAadhaar(dto.getRequiresAadhaar());
        scheme.setRequiresIncomeCertificate(dto.getRequiresIncomeCertificate());
        scheme.setRequiresCommunityCertificate(dto.getRequiresCommunityCertificate());
        scheme.setRequiresOccupationProof(dto.getRequiresOccupationProof());
        
        return schemeRepository.save(scheme);
    }
    
    public void deleteScheme(Long schemeId) throws Exception {
        if (!schemeRepository.existsById(schemeId)) {
            throw new Exception("Scheme not found");
        }
        try {
            schemeRepository.deleteById(schemeId);
        } catch (Exception e) {
            if (e.getMessage().contains("foreign key constraint")) {
                throw new Exception("Cannot delete scheme - applications exist for this scheme. Please delete applications first.");
            }
            throw new Exception("Failed to delete scheme: " + e.getMessage());
        }
    }
}
