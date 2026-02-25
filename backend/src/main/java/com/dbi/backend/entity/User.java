package com.dbi.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String gender;
    
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    @Column(nullable = false, unique = true, length = 10)
    private String mobileNumber;
    
    @Column(unique = true)
    private String email;
    
    @Column(nullable = false)
    @JsonIgnore
    private String passwordHash;
    
    @Column(nullable = false)
    private String casteCategory;
    
    private String casteCertificateNumber;
    
    @Column(nullable = false, unique = true)
    @JsonIgnore
    private String aadhaarNumberHash;
    
    @Column(nullable = false, length = 500)
    private String address;
    
    @Column(nullable = false)
    private String state;
    
    @Column(nullable = false)
    private String district;
    
    private String block;
    
    private String village;
    
    @Column(nullable = false, length = 6)
    private String pincode;
    
    private Double annualIncome;
    
    private String incomeSource;
    
    // Parent details for students
    private String parentName;
    private String parentOccupation;
    private Double parentIncome;
    private String parentMobileNumber;
    
    // Role-specific fields
    private String employeeId;
    private String idCardNumber;
    private String assignedState;
    private String assignedDistrict;
    private String assignedBlock;
    private String departmentName;
    private String designation;
    private String officeLocation;
    private String adminLevel;
    private String accessGrantedBy;
    private String auditLicenseNumber;
    private String monitoringState;
    private String monitoringDistrict;
    private String departmentToMonitor;
    private String sanctioningLevel;
    private Double maxSanctionAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private UserRole role;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
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
