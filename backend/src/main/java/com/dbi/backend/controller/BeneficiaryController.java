package com.dbi.backend.controller;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
import com.dbi.backend.service.BeneficiarySchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/beneficiary")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
public class BeneficiaryController {
    
    @Autowired
    private BeneficiarySchemeService beneficiarySchemeService;
    
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
            @PathVariable Long schemeId) {
        try {
            Long userId = extractUserIdFromToken(token);
            beneficiarySchemeService.applyForScheme(userId, schemeId);
            return ResponseEntity.ok("{\"message\": \"Application submitted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            return ResponseEntity.ok(beneficiarySchemeService.getUserApplications(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
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
