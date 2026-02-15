package com.dbi.backend.service;

import com.dbi.backend.dto.LoginDTO;
import com.dbi.backend.dto.LoginResponseDTO;
import com.dbi.backend.dto.UserRegistrationDTO;
import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.Base64;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(UserRegistrationDTO dto) throws Exception {
        System.out.println("Registration attempt for mobile: " + dto.getMobileNumber() + ", Role: " + dto.getRole());
        
        if (userRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new Exception("Mobile number already registered");
        }
        
        String aadhaarHash = hashAadhaar(dto.getAadhaarNumber());
        if (userRepository.existsByAadhaarNumberHash(aadhaarHash)) {
            throw new Exception("Aadhaar number already registered");
        }
        
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setGender(dto.getGender());
        user.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        user.setMobileNumber(dto.getMobileNumber());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(hashPassword(dto.getPassword()));
        user.setAadhaarNumberHash(aadhaarHash);
        user.setRole(UserRole.valueOf(dto.getRole()));
        
        System.out.println("Password hash created: " + user.getPasswordHash().substring(0, 10) + "...");
        System.out.println("Aadhaar hash created: " + user.getAadhaarNumberHash().substring(0, 10) + "...");
        
        // Set role-specific fields
        if (dto.getRole().equals("BENEFICIARY")) {
            user.setCasteCategory(dto.getCasteCategory());
            user.setCasteCertificateNumber(dto.getCasteCertificateNumber());
            user.setAddress(dto.getAddress());
            user.setState(dto.getState());
            user.setDistrict(dto.getDistrict());
            user.setBlock(dto.getBlock());
            user.setVillage(dto.getVillage());
            user.setPincode(dto.getPincode());
            user.setAnnualIncome(dto.getAnnualIncome());
            user.setIncomeSource(dto.getIncomeSource());
        } else {
            // Common fields for all admin roles
            user.setEmployeeId(dto.getEmployeeId());
            user.setState(dto.getState() != null ? dto.getState() : "N/A");
            user.setDistrict(dto.getDistrict() != null ? dto.getDistrict() : "N/A");
            user.setPincode("000000");
            user.setCasteCategory("N/A");
            user.setAddress("N/A");
            
            // Role-specific fields
            user.setIdCardNumber(dto.getIdCardNumber());
            user.setAssignedState(dto.getAssignedState());
            user.setAssignedDistrict(dto.getAssignedDistrict());
            user.setAssignedBlock(dto.getAssignedBlock());
            user.setDepartmentName(dto.getDepartmentName());
            user.setDesignation(dto.getDesignation());
            user.setOfficeLocation(dto.getOfficeLocation());
            user.setAdminLevel(dto.getAdminLevel());
            user.setAccessGrantedBy(dto.getAccessGrantedBy());
            user.setAuditLicenseNumber(dto.getAuditLicenseNumber());
            user.setMonitoringState(dto.getMonitoringState());
            user.setMonitoringDistrict(dto.getMonitoringDistrict());
            user.setDepartmentToMonitor(dto.getDepartmentToMonitor());
            user.setSanctioningLevel(dto.getSanctioningLevel());
            user.setMaxSanctionAmount(dto.getMaxSanctionAmount());
        }
        
        User savedUser = userRepository.save(user);
        System.out.println("✓ User registered successfully: " + savedUser.getFullName() + " (ID: " + savedUser.getId() + ")");
        return savedUser;
    }
    
    public LoginResponseDTO loginUser(LoginDTO dto) throws Exception {
        System.out.println("Login attempt for mobile: " + dto.getMobileNumber());
        
        User user = userRepository.findByMobileNumber(dto.getMobileNumber())
            .orElseThrow(() -> new Exception("User not registered"));
        
        System.out.println("User found: " + user.getFullName() + ", Role: " + user.getRole());
        
        String aadhaarHash = hashAadhaar(dto.getAadhaarNumber());
        System.out.println("Aadhaar hash match: " + user.getAadhaarNumberHash().equals(aadhaarHash));
        
        if (!user.getAadhaarNumberHash().equals(aadhaarHash)) {
            throw new Exception("Invalid credentials - Aadhaar mismatch");
        }
        
        String passwordHash = hashPassword(dto.getPassword());
        System.out.println("Password hash match: " + user.getPasswordHash().equals(passwordHash));
        
        if (!user.getPasswordHash().equals(passwordHash)) {
            throw new Exception("Invalid credentials - Password mismatch");
        }
        
        String token = Base64.getEncoder().encodeToString(
            (user.getId() + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8)
        );
        
        LoginResponseDTO.UserDTO userDTO = new LoginResponseDTO.UserDTO(
            user.getId(),
            user.getFullName(),
            user.getMobileNumber(),
            user.getEmail(),
            user.getRole().toString()
        );
        
        System.out.println("Login successful for: " + user.getFullName());
        return new LoginResponseDTO(token, userDTO);
    }
    
    private String hashPassword(String password) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
    
    private String hashAadhaar(String aadhaar) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(aadhaar.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}
