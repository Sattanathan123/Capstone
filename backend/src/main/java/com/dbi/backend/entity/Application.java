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
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
}
