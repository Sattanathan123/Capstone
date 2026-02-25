package com.dbi.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "application_id", unique = true, nullable = false)
    private String applicationId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "applied_date", nullable = false)
    private LocalDateTime appliedDate;
    
    @Column(name = "scheme_component")
    private String schemeComponent = "General";
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @Column(name = "verification_remarks", columnDefinition = "TEXT")
    private String verificationRemarks;
    
    @Column(name = "verification_officer_id")
    private Long verificationOfficerId;
    
    @Column(name = "verified_date")
    private LocalDateTime verifiedDate;
    
    @Column(name = "sanctioning_officer_id")
    private Long sanctioningOfficerId;
    
    @Column(name = "sanctioned_date")
    private LocalDateTime sanctionedDate;
    
    @Column(name = "sanctioning_remarks", columnDefinition = "TEXT")
    private String sanctioningRemarks;
    
    @Column(name = "sanctioned_amount")
    private Double sanctionedAmount;
    
    @Column(name = "priority")
    private String priority = "Medium";
    
    @Column(name = "aadhaar_doc", columnDefinition = "LONGTEXT")
    private String aadhaarDoc;
    
    @Column(name = "income_cert_doc", columnDefinition = "LONGTEXT")
    private String incomeCertDoc;
    
    @Column(name = "community_cert_doc", columnDefinition = "LONGTEXT")
    private String communityCertDoc;
    
    @Column(name = "occupation_proof_doc", columnDefinition = "LONGTEXT")
    private String occupationProofDoc;
}
