package com.dbi.backend.controller;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
import com.dbi.backend.entity.Application;
import com.dbi.backend.service.BeneficiarySchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/beneficiary")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000", "http://localhost:3001"})
public class BeneficiaryController {
    
    @Autowired
    private BeneficiarySchemeService beneficiarySchemeService;
    
    @Autowired
    private javax.sql.DataSource dataSource;
    
    @Autowired
    private com.dbi.backend.repository.SchemeRepository schemeRepository;
    
    @Autowired
    private com.dbi.backend.repository.UserRepository userRepository;
    
    @GetMapping("/eligible-schemes")
    public ResponseEntity<?> getEligibleSchemes(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            BeneficiaryEligibleSchemesDTO data = beneficiarySchemeService.getEligibleSchemes(userId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/apply/{schemeId}")
    public ResponseEntity<?> applyForScheme(
            @RequestHeader("Authorization") String token,
            @PathVariable Long schemeId,
            @RequestBody(required = false) java.util.Map<String, String> documents) {
        try {
            Long userId = extractUserIdFromToken(token);
            com.dbi.backend.service.SmartValidationEngine.ValidationResult result = 
                beneficiarySchemeService.applyForScheme(userId, schemeId, documents);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            List<Application> applications = beneficiarySchemeService.getApplicationRepository().findByUserId(userId);
            
            List<java.util.Map<String, Object>> result = applications.stream()
                .map(app -> {
                    java.util.Map<String, Object> dto = new java.util.HashMap<>();
                    dto.put("id", app.getId());
                    dto.put("applicationId", app.getApplicationId());
                    dto.put("schemeName", app.getScheme().getSchemeName());
                    dto.put("status", app.getStatus());
                    dto.put("appliedDate", app.getAppliedDate());
                    dto.put("remarks", app.getRemarks());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @GetMapping("/schemes/{schemeId}")
    public ResponseEntity<?> getSchemeById(@PathVariable Long schemeId) {
        try {
            return ResponseEntity.ok(schemeRepository.findById(schemeId)
                .orElseThrow(() -> new Exception("Scheme not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/debug-eligibility")
    public ResponseEntity<?> debugEligibility(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            BeneficiaryEligibleSchemesDTO data = beneficiarySchemeService.getEligibleSchemes(userId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @GetMapping("/bank-details")
    public ResponseEntity<?> getBankDetails(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            com.dbi.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
            
            java.util.Map<String, String> bankDetails = new java.util.HashMap<>();
            bankDetails.put("bankAccountNumber", user.getBankAccountNumber());
            bankDetails.put("bankIfscCode", user.getBankIfscCode());
            bankDetails.put("bankName", user.getBankName());
            bankDetails.put("accountHolderName", user.getAccountHolderName());
            
            return ResponseEntity.ok(bankDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/bank-details")
    public ResponseEntity<?> saveBankDetails(
            @RequestHeader("Authorization") String token,
            @RequestBody java.util.Map<String, String> bankDetails) {
        try {
            Long userId = extractUserIdFromToken(token);
            com.dbi.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
            
            user.setBankAccountNumber(bankDetails.get("bankAccountNumber"));
            user.setBankIfscCode(bankDetails.get("bankIfscCode"));
            user.setBankName(bankDetails.get("bankName"));
            user.setAccountHolderName(bankDetails.get("accountHolderName"));
            
            userRepository.save(user);
            
            return ResponseEntity.ok("{\"message\": \"Bank details saved successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private Long extractUserIdFromToken(String token) throws Exception {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String decoded = new String(java.util.Base64.getDecoder().decode(cleanToken));
            String userId = decoded.split(":")[0];
            return Long.parseLong(userId);
        } catch (Exception e) {
            throw new Exception("Invalid token");
        }
    }
}
