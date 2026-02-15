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
    
    @Column(nullable = false)
    private String schemeName;
    
    @Column(columnDefinition = "TEXT")
    private String schemeDescription;
    
    @Column(nullable = false)
    private String schemeComponent; // ADARSH_GRAM, GIA, HOSTEL
    
    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE
    
    // Eligibility Criteria
    @Column(nullable = false)
    private Double minIncome;
    
    @Column(nullable = false)
    private Double maxIncome;
    
    @Column(nullable = false)
    private String community; // SC, ST, OBC, GENERAL, OTHERS
    
    @Column(nullable = false)
    private String occupation;
    
    // Benefit Details
    @Column(nullable = false)
    private String benefitType; // FINANCIAL, SERVICE, INFRASTRUCTURE
    
    @Column(nullable = false)
    private Double maxBenefitAmount;
    
    // Timeline
    @Column(nullable = false)
    private LocalDate applicationStartDate;
    
    @Column(nullable = false)
    private LocalDate applicationEndDate;
    
    // Documents Required
    private Boolean requiresAadhaar = true;
    private Boolean requiresIncomeCertificate = true;
    private Boolean requiresCommunityCertificate = true;
    private Boolean requiresOccupationProof = true;
    
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
