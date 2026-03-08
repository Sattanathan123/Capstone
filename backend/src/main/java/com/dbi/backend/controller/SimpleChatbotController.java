package com.dbi.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class SimpleChatbotController {
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("status", "Chatbot is working!"));
    }
    
    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            String message = request.get("message").toString().toLowerCase();
            
            String response;
            String intent;
            List<String> suggestions;
            
            if (message.contains("scheme") || message.contains("available")) {
                response = "📋 Available Government Schemes:\n\n• Education Scholarship\n• Health Insurance\n• Agriculture Support\n\nLogin to see schemes you're eligible for!";
                intent = "LIST_SCHEMES";
                suggestions = List.of("Check eligibility", "How to apply?", "Required documents");
            } else if (message.contains("eligible") || message.contains("eligibility")) {
                response = "✅ To check eligibility:\n\n1. Login to your account\n2. Go to dashboard\n3. View 'Eligible Schemes' section\n\nYour eligibility is automatically calculated based on your profile!";
                intent = "CHECK_ELIGIBILITY";
                suggestions = List.of("Show schemes", "How to apply?", "Help");
            } else if (message.contains("apply") || message.contains("how to")) {
                response = "📝 Steps to Apply:\n\n1. Login to your account\n2. Go to 'Eligible Schemes'\n3. Select a scheme\n4. Fill application form\n5. Upload documents\n6. Submit\n\nYou'll get confirmation instantly!";
                intent = "HOW_TO_APPLY";
                suggestions = List.of("Required documents", "Show schemes", "Help");
            } else if (message.contains("document")) {
                response = "📄 Required Documents:\n\n• Aadhaar Card\n• Income Certificate\n• Caste Certificate\n• Bank Details\n• Educational Certificates\n• Photo\n\nSpecific requirements vary by scheme.";
                intent = "REQUIRED_DOCUMENTS";
                suggestions = List.of("Show schemes", "How to apply?", "Help");
            } else if (message.contains("status") || message.contains("track")) {
                response = "📊 To track your application:\n\n1. Login to dashboard\n2. View 'My Applications'\n3. Check real-time status\n\nYou'll see: Submitted → Verified → Approved → Disbursed";
                intent = "CHECK_STATUS";
                suggestions = List.of("Show schemes", "Help", "Contact");
            } else if (message.contains("contact") || message.contains("help") || message.contains("support")) {
                response = "📞 Contact & Support:\n\n• Helpline: 1800-XXX-XXXX\n• Email: support@beneflow.gov.in\n• Hours: 9 AM - 6 PM (Mon-Fri)\n\nFor technical issues, contact your District Admin.";
                intent = "CONTACT_INFO";
                suggestions = List.of("Show schemes", "How to apply?", "Check eligibility");
            } else if (message.contains("hi") || message.contains("hello") || message.contains("hey")) {
                response = "Hello! 👋 I'm your Beneflow assistant.\n\nI can help with:\n• Finding schemes\n• Checking eligibility\n• Application guidance\n• Status tracking\n\nWhat would you like to know?";
                intent = "GREETING";
                suggestions = List.of("Show schemes", "Check eligibility", "How to apply?");
            } else {
                response = "I can help you with:\n\n• Available schemes\n• Eligibility checks\n• Application process\n• Document requirements\n• Status tracking\n\nWhat would you like to know?";
                intent = "UNKNOWN";
                suggestions = List.of("Show schemes", "Check eligibility", "Help");
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("intent", intent);
            result.put("suggestions", suggestions);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("response", "I'm here to help! Try asking about schemes, eligibility, or how to apply.");
            error.put("intent", "ERROR");
            error.put("suggestions", List.of("Show schemes", "Help"));
            return ResponseEntity.ok(error);
        }
    }
}
