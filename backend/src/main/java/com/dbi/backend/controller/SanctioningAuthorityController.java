package com.dbi.backend.controller;

import com.dbi.backend.entity.Application;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.UserRepository;
import com.dbi.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sanctioning")
@CrossOrigin(origins = "http://localhost:3000")
public class SanctioningAuthorityController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.dbi.backend.service.FundTransferService fundTransferService;

    @GetMapping("/pending-sanctions")
    public ResponseEntity<?> getPendingSanctions(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User authority = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Authority not found"));

            System.out.println("=== SANCTIONING AUTHORITY ===");
            System.out.println("Authority: " + authority.getFullName());
            System.out.println("Assigned District: '" + authority.getAssignedDistrict() + "'");

            if (authority.getAssignedDistrict() == null || authority.getAssignedDistrict().isEmpty()) {
                System.out.println("No district assigned - returning empty list");
                return ResponseEntity.ok(List.of());
            }

            List<Application> applications = applicationRepository
                .findByStatusAndUserAssignedDistrict("APPROVED", authority.getAssignedDistrict());

            System.out.println("Query: Status=APPROVED, District='" + authority.getAssignedDistrict() + "'");
            System.out.println("Total approved applications in district: " + applications.size());
            for (Application app : applications) {
                System.out.println("  - App ID: " + app.getId() + 
                    ", Beneficiary: " + app.getUser().getFullName() + 
                    ", District: '" + app.getUser().getDistrict() + "'" +
                    ", Status: " + app.getStatus() +
                    ", Scheme: " + app.getScheme().getSchemeName());
            }
            System.out.println("============================");

            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User authority = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Authority not found"));

            Map<String, Object> stats = new HashMap<>();
            
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            long todayCount = applicationRepository.countBySanctioningOfficerIdAndSanctionedDateAfter(
                authority.getId(), startOfDay);
            
            long pendingCount = authority.getAssignedDistrict() != null && !authority.getAssignedDistrict().isEmpty()
                ? applicationRepository.countByStatusAndUserAssignedDistrict("APPROVED", authority.getAssignedDistrict())
                : 0;
            
            long sanctionedCount = applicationRepository.countBySanctioningOfficerIdAndStatus(
                authority.getId(), "SANCTIONED");
            
            long rejectedCount = applicationRepository.countBySanctioningOfficerIdAndStatus(
                authority.getId(), "REJECTED");

            stats.put("today", todayCount);
            stats.put("pending", pendingCount);
            stats.put("sanctioned", sanctionedCount);
            stats.put("rejected", rejectedCount);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sanction/{applicationId}")
    public ResponseEntity<?> sanctionApplication(
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User authority = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Authority not found"));

            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            String status = (String) request.get("status");
            String remarks = (String) request.get("remarks");
            Double amount = request.get("amount") != null ? 
                Double.parseDouble(request.get("amount").toString()) : null;

            application.setStatus(status);
            application.setRemarks("SANCTIONED".equals(status) 
                ? "Application sanctioned. Amount: ₹" + amount
                : remarks);
            application.setSanctioningRemarks(remarks);
            application.setSanctioningOfficerId(authority.getId());
            application.setSanctionedDate(LocalDateTime.now());
            
            if ("SANCTIONED".equals(status) && amount != null) {
                application.setSanctionedAmount(amount);
            }

            applicationRepository.save(application);
            
            // Auto-initiate fund transfer if sanctioned
            if ("SANCTIONED".equals(status) && amount != null) {
                User beneficiary = application.getUser();
                System.out.println("=== FUND TRANSFER CHECK ===");
                System.out.println("Beneficiary: " + beneficiary.getFullName());
                System.out.println("Bank Account: " + beneficiary.getBankAccountNumber());
                System.out.println("IFSC: " + beneficiary.getBankIfscCode());
                System.out.println("Amount: " + amount);
                
                if (beneficiary.getBankAccountNumber() != null && !beneficiary.getBankAccountNumber().isEmpty()) {
                    try {
                        fundTransferService.initiateFundTransfer(
                            applicationId,
                            beneficiary.getBankAccountNumber(),
                            beneficiary.getBankIfscCode(),
                            amount
                        );
                        System.out.println("✓ Fund transfer initiated successfully");
                    } catch (Exception e) {
                        System.err.println("✗ Fund transfer error: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("✗ Bank details not available");
                }
                System.out.println("===========================");
            }
            
            String message = "SANCTIONED".equals(status)
                ? "Congratulations! Your application " + application.getApplicationId() + " for " + application.getScheme().getSchemeName() + " has been sanctioned. Approved amount: ₹" + amount + ". The benefits will be disbursed to your account shortly."
                : "Your application " + application.getApplicationId() + " for " + application.getScheme().getSchemeName() + " has been rejected by the sanctioning authority. Reason: " + remarks;
            notificationService.createNotification(application.getUser().getId(), message, status, applicationId);

            return ResponseEntity.ok("Application " + status + " successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
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
