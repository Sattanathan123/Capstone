package com.dbi.backend.controller;

import com.dbi.backend.entity.Application;
import com.dbi.backend.entity.Feedback;
import com.dbi.backend.entity.User;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.FeedbackRepository;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== FEEDBACK SUBMIT ===");
            System.out.println("Request: " + request);

            Long userId = extractUserIdFromToken(token);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));

            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new Exception("Application not found"));

            if (feedbackRepository.existsByApplicationId(applicationId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Feedback already submitted for this application"));
            }

            Feedback feedback = new Feedback();
            feedback.setUser(user);
            feedback.setApplication(application);
            feedback.setRating(Integer.valueOf(request.get("rating").toString()));
            feedback.setComments(request.get("comments") != null ? request.get("comments").toString() : "");
            feedback.setAmountSpentOn(request.get("amountSpentOn") != null ? request.get("amountSpentOn").toString() : "");
            feedback.setBenefitReceived(request.get("benefitReceived") != null ? request.get("benefitReceived").toString() : "");
            feedback.setWouldRecommend(request.get("wouldRecommend") != null ? Boolean.valueOf(request.get("wouldRecommend").toString()) : null);
            feedback.setSuggestions(request.get("suggestions") != null ? request.get("suggestions").toString() : "");

            System.out.println("Saving feedback - amountSpentOn: " + feedback.getAmountSpentOn());
            System.out.println("Saving feedback - benefitReceived: " + feedback.getBenefitReceived());
            System.out.println("Saving feedback - wouldRecommend: " + feedback.getWouldRecommend());
            System.out.println("Saving feedback - suggestions: " + feedback.getSuggestions());

            feedbackRepository.save(feedback);
            System.out.println("Feedback saved successfully!");
            System.out.println("======================");

            return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check/{applicationId}")
    public ResponseEntity<?> checkFeedback(
            @RequestHeader("Authorization") String token,
            @PathVariable Long applicationId) {
        try {
            boolean exists = feedbackRepository.existsByApplicationId(applicationId);
            return ResponseEntity.ok(Map.of("submitted", exists));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedbacks(@RequestHeader("Authorization") String token) {
        try {
            List<Feedback> feedbacks = feedbackRepository.findAllByOrderBySubmittedAtDesc();
            System.out.println("=== FETCHING ALL FEEDBACKS: " + feedbacks.size() + " ===");
            List<Map<String, Object>> result = new ArrayList<>();

            for (Feedback f : feedbacks) {
                System.out.println("Feedback ID: " + f.getId() + 
                    ", amountSpentOn: " + f.getAmountSpentOn() +
                    ", benefitReceived: " + f.getBenefitReceived() +
                    ", wouldRecommend: " + f.getWouldRecommend() +
                    ", suggestions: " + f.getSuggestions());

                Map<String, Object> map = new HashMap<>();
                map.put("id", f.getId());
                map.put("beneficiaryName", f.getUser().getFullName());
                map.put("district", f.getUser().getDistrict());
                map.put("schemeName", f.getApplication().getScheme().getSchemeName());
                map.put("applicationId", f.getApplication().getApplicationId());
                map.put("rating", f.getRating());
                map.put("comments", f.getComments());
                map.put("amountSpentOn", f.getAmountSpentOn());
                map.put("benefitReceived", f.getBenefitReceived());
                map.put("wouldRecommend", f.getWouldRecommend());
                map.put("suggestions", f.getSuggestions());
                map.put("submittedAt", f.getSubmittedAt());
                result.add(map);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long extractUserIdFromToken(String token) throws Exception {
        String cleanToken = token.replace("Bearer ", "");
        String decoded = new String(java.util.Base64.getDecoder().decode(cleanToken));
        return Long.parseLong(decoded.split(":")[0]);
    }
}
