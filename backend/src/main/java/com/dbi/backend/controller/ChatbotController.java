package com.dbi.backend.controller;

import com.dbi.backend.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("message", "Chatbot API is working!"));
    }
    
    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        System.out.println("Received chatbot request: " + request);
        try {
            String message = request.get("message").toString();
            System.out.println("Message: " + message);
            
            Long userId = request.get("userId") != null ? 
                Long.valueOf(request.get("userId").toString()) : null;
            String sessionId = request.get("sessionId") != null ? 
                request.get("sessionId").toString() : UUID.randomUUID().toString();
            
            Map<String, Object> response = chatbotService.processMessage(message, userId, sessionId);
            System.out.println("Generated response: " + response);
            
            // Ensure response is not null or empty
            if (response == null || response.get("response") == null) {
                response = new HashMap<>();
                response.put("response", "I'm having trouble processing that. Could you rephrase your question?");
                response.put("intent", "ERROR");
                response.put("suggestions", List.of("Show schemes", "Check eligibility", "Help"));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("response", "Sorry, I encountered an error: " + e.getMessage());
            errorResponse.put("intent", "ERROR");
            errorResponse.put("suggestions", List.of("Show schemes", "Help"));
            return ResponseEntity.ok(errorResponse);
        }
    }
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionHistory(@PathVariable String sessionId) {
        // Can be implemented to retrieve chat history
        return ResponseEntity.ok(Map.of("message", "Session history"));
    }
}
