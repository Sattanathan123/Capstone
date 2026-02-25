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
@RequestMapping("/api/officer")
@CrossOrigin(origins = "http://localhost:3000")
public class FieldOfficerController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/pending-verifications")
    public ResponseEntity<?> getPendingVerifications(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User officer = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            System.out.println("=== FIELD OFFICER VERIFICATION ===");
            System.out.println("Officer ID: " + officer.getId());
            System.out.println("Officer Name: " + officer.getFullName());
            System.out.println("Officer Assigned District: " + officer.getAssignedDistrict());

            List<Application> applications;
            
            if (officer.getAssignedDistrict() != null && !officer.getAssignedDistrict().isEmpty()) {
                applications = applicationRepository.findByStatusAndUserAssignedDistrict(
                        "PENDING_VERIFICATION", officer.getAssignedDistrict());
                System.out.println("Filtering by district: " + officer.getAssignedDistrict());
            } else {
                applications = applicationRepository.findByStatus("PENDING_VERIFICATION");
                System.out.println("No district assigned, showing all");
            }
            
            System.out.println("Found " + applications.size() + " pending applications");
            for (Application app : applications) {
                System.out.println("  - App ID: " + app.getId() + 
                                 ", Beneficiary: " + app.getUser().getFullName() + 
                                 ", District: " + app.getUser().getDistrict() +
                                 ", Scheme: " + app.getScheme().getSchemeName());
            }
            System.out.println("===================================");

            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all-verifications")
    public ResponseEntity<?> getAllVerifications(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User officer = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            List<Application> applications = applicationRepository.findAll();
            
            System.out.println("=== ALL VERIFICATIONS ===");
            System.out.println("Total applications in DB: " + applications.size());
            
            // Filter by district and officer's verified applications
            applications = applications.stream()
                .filter(app -> {
                    try {
                        // Skip applications with null or invalid scheme
                        if (app.getScheme() == null || app.getScheme().getId() == null) {
                            System.out.println("Skipping app " + app.getId() + " - null scheme");
                            return false;
                        }
                        
                        boolean matchesDistrict = officer.getAssignedDistrict() == null || 
                            officer.getAssignedDistrict().isEmpty() ||
                            officer.getAssignedDistrict().equals(app.getUser().getDistrict());
                        
                        boolean isPending = "PENDING_VERIFICATION".equals(app.getStatus());
                        boolean isVerifiedByOfficer = officer.getId().equals(app.getVerificationOfficerId());
                        
                        boolean include = matchesDistrict && (isPending || isVerifiedByOfficer);
                        
                        if (include) {
                            System.out.println("Including app " + app.getId() + 
                                " - Status: " + app.getStatus() + 
                                ", District: " + app.getUser().getDistrict() +
                                ", Scheme: " + app.getScheme().getSchemeName());
                        }
                        
                        return include;
                    } catch (Exception e) {
                        System.err.println("Error processing app " + app.getId() + ": " + e.getMessage());
                        return false;
                    }
                })
                .collect(java.util.stream.Collectors.toList());

            System.out.println("Filtered applications: " + applications.size());
            System.out.println("===========================");
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getOfficerStats(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User officer = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            Map<String, Object> stats = new HashMap<>();
            
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            long todayCount = applicationRepository.countByVerificationOfficerIdAndVerifiedDateAfter(
                    officer.getId(), startOfDay);
            
            long pendingCount;
            if (officer.getAssignedDistrict() != null && !officer.getAssignedDistrict().isEmpty()) {
                pendingCount = applicationRepository.countByStatusAndUserAssignedDistrict(
                        "PENDING_VERIFICATION", officer.getAssignedDistrict());
            } else {
                pendingCount = applicationRepository.findByStatus("PENDING_VERIFICATION").size();
            }
            
            long approvedCount = applicationRepository.countByVerificationOfficerIdAndStatus(
                    officer.getId(), "APPROVED");
            
            long rejectedCount = applicationRepository.countByVerificationOfficerIdAndStatus(
                    officer.getId(), "REJECTED");

            stats.put("today", todayCount);
            stats.put("pending", pendingCount);
            stats.put("approved", approvedCount);
            stats.put("rejected", rejectedCount);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<?> getApplicationDetails(
            @PathVariable Long applicationId,
            @RequestHeader("Authorization") String token) {
        try {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
            
            System.out.println("=== FETCHING APPLICATION DETAILS ===");
            System.out.println("Application ID: " + applicationId);
            System.out.println("Has Aadhaar Doc: " + (application.getAadhaarDoc() != null));
            System.out.println("Has Income Doc: " + (application.getIncomeCertDoc() != null));
            System.out.println("Has Community Doc: " + (application.getCommunityCertDoc() != null));
            System.out.println("Has Occupation Doc: " + (application.getOccupationProofDoc() != null));
            System.out.println("=====================================");
            
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify/{applicationId}")
    public ResponseEntity<?> verifyApplication(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            User officer = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));

            String status = request.get("status");
            String remarks = request.get("remarks");

            System.out.println("=== FIELD OFFICER VERIFICATION ===");
            System.out.println("Application ID: " + applicationId);
            System.out.println("Current Status: " + application.getStatus());
            System.out.println("New Status: " + status);
            System.out.println("Beneficiary District: '" + application.getUser().getDistrict() + "'");
            System.out.println("===================================");

            application.setStatus(status);
            application.setRemarks(remarks);
            application.setVerificationOfficerId(officer.getId());
            application.setVerifiedDate(LocalDateTime.now());

            applicationRepository.save(application);
            
            String message = "APPROVED".equals(status) 
                ? "Good news! Your application " + application.getApplicationId() + " for " + application.getScheme().getSchemeName() + " has been verified by the field officer and forwarded to the sanctioning authority for final approval."
                : "Your application " + application.getApplicationId() + " for " + application.getScheme().getSchemeName() + " has been rejected by the field officer. Reason: " + remarks;
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
