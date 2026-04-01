package com.dbi.backend.controller;

import com.dbi.backend.entity.Application;
import com.dbi.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/track")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
public class TrackingController {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @GetMapping("/{applicationId}")
    public ResponseEntity<?> trackApplication(@PathVariable String applicationId) {
        try {
            Application app = applicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new Exception("Application not found"));
            
            Map<String, Object> tracking = new HashMap<>();
            tracking.put("applicationId", app.getApplicationId());
            tracking.put("schemeName", app.getScheme().getSchemeName());
            tracking.put("applicantName", app.getUser().getFullName());
            tracking.put("status", app.getStatus());
            tracking.put("appliedDate", app.getAppliedDate());
            tracking.put("verifiedDate", app.getVerifiedDate());
            tracking.put("sanctionedDate", app.getSanctionedDate());
            tracking.put("sanctionedAmount", app.getSanctionedAmount());
            tracking.put("remarks", app.getRemarks());
            tracking.put("verificationRemarks", app.getRemarks());
            tracking.put("sanctioningRemarks", app.getRemarks());
            
            // Determine who rejected
            boolean rejectedByFieldOfficer = "REJECTED".equals(app.getStatus()) && app.getVerificationOfficerId() != null;
            boolean rejectedBySanctioning = "REJECTED".equals(app.getStatus()) && app.getSanctioningOfficerId() != null;

            Map<String, Object> timeline = new HashMap<>();
            timeline.put("submitted", app.getAppliedDate() != null);
            timeline.put("underReview", app.getAppliedDate() != null);
            timeline.put("verified", "APPROVED".equals(app.getStatus()) || "SANCTIONED".equals(app.getStatus()) || rejectedBySanctioning);
            timeline.put("sanctioned", "SANCTIONED".equals(app.getStatus()));
            timeline.put("rejected", "REJECTED".equals(app.getStatus()));
            timeline.put("rejectedByFieldOfficer", rejectedByFieldOfficer);
            timeline.put("rejectedBySanctioning", rejectedBySanctioning);
            tracking.put("timeline", timeline);
            
            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
