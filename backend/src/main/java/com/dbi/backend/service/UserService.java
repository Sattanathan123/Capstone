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
        user.setCasteCategory(dto.getCasteCategory());
        user.setCasteCertificateNumber(dto.getCasteCertificateNumber());
        user.setAadhaarNumberHash(aadhaarHash);
        user.setAddress(dto.getAddress());
        user.setState(dto.getState());
        user.setDistrict(dto.getDistrict());
        user.setBlock(dto.getBlock());
        user.setVillage(dto.getVillage());
        user.setPincode(dto.getPincode());
        user.setAnnualIncome(dto.getAnnualIncome());
        user.setIncomeSource(dto.getIncomeSource());
        user.setRole(UserRole.valueOf(dto.getRole()));
        
        return userRepository.save(user);
    }
    
    public LoginResponseDTO loginUser(LoginDTO dto) throws Exception {
        User user = userRepository.findByMobileNumber(dto.getMobileNumber())
            .orElseThrow(() -> new Exception("User not registered"));
        
        String aadhaarHash = hashAadhaar(dto.getAadhaarNumber());
        if (!user.getAadhaarNumberHash().equals(aadhaarHash)) {
            throw new Exception("Invalid credentials");
        }
        
        String passwordHash = hashPassword(dto.getPassword());
        if (!user.getPasswordHash().equals(passwordHash)) {
            throw new Exception("Invalid credentials");
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
