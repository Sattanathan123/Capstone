package com.dbi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "scheme_name")
    private String schemeName;
    
    @Column(name = "scheme_description", columnDefinition = "TEXT")
    private String schemeDescription;
    
    @Column(name = "benefit_type")
    private String benefitType;
    
    @Column(name = "scheme_component")
    private String schemeComponent;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "min_income")
    private Double minIncome;
    
    @Column(name = "max_income")
    private Double maxIncome;
    
    @Column(name = "max_benefit_amount")
    private Double maxBenefitAmount;
    
    @Column(name = "community")
    private String community;
    
    @Column(name = "occupation")
    private String occupation;
    
    @Column(name = "application_start_date")
    private LocalDate applicationStartDate;
    
    @Column(name = "application_end_date")
    private LocalDate applicationEndDate;
    
    @Column(name = "requires_aadhaar")
    private Boolean requiresAadhaar;
    
    @Column(name = "requires_income_certificate")
    private Boolean requiresIncomeCertificate;
    
    @Column(name = "requires_community_certificate")
    private Boolean requiresCommunityCertificate;
    
    @Column(name = "requires_occupation_proof")
    private Boolean requiresOccupationProof;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
