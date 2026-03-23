package com.dbi.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "application_ref")
    private String applicationRef;

    @Column(name = "scheme_name")
    private String schemeName;

    @Column(name = "beneficiary_name")
    private String beneficiaryName;

    @Column(nullable = false)
    private String action;

    @Column(name = "previous_status")
    private String previousStatus;

    @Column(name = "new_status")
    private String newStatus;

    @Column(name = "performed_by_id")
    private Long performedById;

    @Column(name = "performed_by_name")
    private String performedByName;

    @Column(name = "performed_by_role")
    private String performedByRole;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    @PrePersist
    protected void onCreate() {
        performedAt = LocalDateTime.now();
    }
}
