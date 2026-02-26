package com.dbi.backend.controller;

import com.dbi.backend.dto.SchemeDTO;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.entity.UserRole;
import com.dbi.backend.service.SchemeService;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private SchemeService schemeService;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/schemes")
    public ResponseEntity<?> getAllSchemes(@RequestHeader("Authorization") String token) {
        try {
            List<Scheme> schemes = schemeService.getAllSchemes();
            return ResponseEntity.ok(schemes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/schemes")
    public ResponseEntity<?> createScheme(
            @RequestHeader("Authorization") String token,
            @RequestBody SchemeDTO schemeDTO) {
        try {
            Scheme scheme = schemeService.createScheme(schemeDTO);
            return ResponseEntity.ok(scheme);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<?> deleteScheme(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            schemeService.deleteScheme(id);
            return ResponseEntity.ok("{\"message\": \"Scheme deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "month") String range) {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalApplications = applicationRepository.count();
        long approvedApplications = applicationRepository.countByStatus("APPROVED");
        long rejectedApplications = applicationRepository.countByStatus("REJECTED");
        long pendingApplications = applicationRepository.countByStatus("PENDING_VERIFICATION");
        long totalBeneficiaries = userRepository.countByRole(UserRole.BENEFICIARY);
        long totalSchemes = schemeService.getAllSchemes().size();
        
        // Get scheme-wise application data
        List<Map<String, Object>> schemeWiseData = getSchemeWiseApplicationData();
        
        analytics.put("totalApplications", totalApplications);
        analytics.put("approvedApplications", approvedApplications);
        analytics.put("rejectedApplications", rejectedApplications);
        analytics.put("pendingApplications", pendingApplications);
        analytics.put("mySchemes", totalSchemes);
        analytics.put("activeSchemes", totalSchemes);
        analytics.put("schemeWiseData", schemeWiseData);
        
        return ResponseEntity.ok(analytics);
    }
    
    private List<Map<String, Object>> getSchemeWiseApplicationData() {
        List<Map<String, Object>> schemeWiseData = new ArrayList<>();
        List<Scheme> schemes = schemeService.getAllSchemes();
        
        for (Scheme scheme : schemes) {
            Map<String, Object> schemeData = new HashMap<>();
            long applicationCount = applicationRepository.countBySchemeId(scheme.getId());
            
            schemeData.put("schemeName", scheme.getSchemeName());
            schemeData.put("applicationCount", applicationCount);
            schemeWiseData.add(schemeData);
        }
        
        return schemeWiseData;
    }
}
