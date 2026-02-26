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
