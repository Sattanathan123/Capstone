package com.dbi.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {
    private String fullName;
    private String gender;
    private String dateOfBirth;
    private String mobileNumber;
    private String email;
    private String password;
    private String casteCategory;
    private String casteCertificateNumber;
    private String aadhaarNumber;
    private String address;
    private String state;
    private String district;
    private String block;
    private String village;
    private String pincode;
    private Double annualIncome;
    private String incomeSource;
    private String role;
    
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
}
