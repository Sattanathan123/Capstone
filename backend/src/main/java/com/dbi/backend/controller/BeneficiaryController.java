package com.dbi.backend.controller;

import com.dbi.backend.dto.BeneficiaryEligibleSchemesDTO;
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
            beneficiarySchemeService.applyForScheme(userId, schemeId, documents);
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
            List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
            
            try (java.sql.Connection conn = dataSource.getConnection()) {
                // First get applications
                java.sql.PreparedStatement stmt1 = conn.prepareStatement(
                    "SELECT id, scheme_id, status, applied_date, remarks FROM applications WHERE user_id = ?");
                stmt1.setLong(1, userId);
                java.sql.ResultSet rs1 = stmt1.executeQuery();
                
                while (rs1.next()) {
                    Long schemeId = rs1.getLong("scheme_id");
                    
                    // Get scheme name
                    java.sql.PreparedStatement stmt2 = conn.prepareStatement(
                        "SELECT scheme_name FROM schemes WHERE id = ?");
                    stmt2.setLong(1, schemeId);
                    java.sql.ResultSet rs2 = stmt2.executeQuery();
                    
                    String schemeName = "Unknown Scheme";
                    if (rs2.next()) {
                        schemeName = rs2.getString("scheme_name");
                    }
                    rs2.close();
                    stmt2.close();
                    
                    java.util.Map<String, Object> dto = new java.util.HashMap<>();
                    dto.put("id", rs1.getLong("id"));
                    dto.put("schemeName", schemeName);
                    dto.put("status", rs1.getString("status"));
                    dto.put("appliedDate", rs1.getTimestamp("applied_date"));
                    dto.put("remarks", rs1.getString("remarks"));
                    result.add(dto);
                }
                rs1.close();
                stmt1.close();
            }
            
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
            return ResponseEntity.ok(beneficiarySchemeService.debugEligibility(userId));
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
