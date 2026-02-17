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
    private String schemeComponent;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
}
