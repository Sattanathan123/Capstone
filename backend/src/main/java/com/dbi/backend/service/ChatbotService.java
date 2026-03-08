package com.dbi.backend.service;

import com.dbi.backend.entity.*;
import com.dbi.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.time.LocalDate;
import java.time.Period;

@Service
public class ChatbotService {
    
    @Autowired(required = false)
    private SchemeRepository schemeRepository;
    
    @Autowired(required = false)
    private ApplicationRepository applicationRepository;
    
    @Autowired(required = false)
    private UserRepository userRepository;
    
    @Autowired(required = false)
    private ChatLogRepository chatLogRepository;
    
    public Map<String, Object> processMessage(String message, Long userId, String sessionId) {
        try {
            String intent = detectIntent(message);
            String response = generateResponse(intent, message, userId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("intent", intent);
            result.put("suggestions", getSuggestions(intent));
            
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("response", "I can help with schemes, eligibility, and applications. What would you like to know?");
            result.put("intent", "ERROR");
            result.put("suggestions", List.of("Show schemes", "Check eligibility", "Help"));
            return result;
        }
    }
    
    private String detectIntent(String message) {
        String msg = message.toLowerCase();
        
        if (msg.contains("scheme") || msg.contains("program") || msg.contains("yojana")) {
            if (msg.contains("education") || msg.contains("scholarship") || msg.contains("student"))
                return "EDUCATION_SCHEMES";
            if (msg.contains("health") || msg.contains("medical"))
                return "HEALTH_SCHEMES";
            if (msg.contains("agriculture") || msg.contains("farmer"))
                return "AGRICULTURE_SCHEMES";
            return "LIST_SCHEMES";
        }
        
        if (msg.contains("eligible") || msg.contains("eligibility") || msg.contains("qualify"))
            return "CHECK_ELIGIBILITY";
        
        if (msg.contains("apply") || msg.contains("application") || msg.contains("how to"))
            return "HOW_TO_APPLY";
        
        if (msg.contains("status") || msg.contains("track") || msg.contains("check application"))
            return "CHECK_STATUS";
        
        if (msg.contains("document") || msg.contains("required") || msg.contains("need"))
            return "REQUIRED_DOCUMENTS";
        
        if (msg.contains("contact") || msg.contains("help") || msg.contains("support"))
            return "CONTACT_INFO";
        
        if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey"))
            return "GREETING";
        
        return "UNKNOWN";
    }
    
    private String generateResponse(String intent, String message, Long userId) {
        switch (intent) {
            case "GREETING":
                return "Hello! 👋 I'm your Beneflow assistant. I can help you with:\n" +
                       "• Finding government schemes\n" +
                       "• Checking eligibility\n" +
                       "• Application guidance\n" +
                       "• Tracking application status\n\n" +
                       "How can I assist you today?";
            
            case "LIST_SCHEMES":
                return getSchemesList();
            
            case "EDUCATION_SCHEMES":
                return getSchemesByCategory("Education");
            
            case "HEALTH_SCHEMES":
                return getSchemesByCategory("Health");
            
            case "AGRICULTURE_SCHEMES":
                return getSchemesByCategory("Agriculture");
            
            case "CHECK_ELIGIBILITY":
                return getEligibilityInfo(userId);
            
            case "HOW_TO_APPLY":
                return "📝 Steps to Apply:\n\n" +
                       "1. Login to your account\n" +
                       "2. Go to 'Eligible Schemes' section\n" +
                       "3. Select a scheme you're eligible for\n" +
                       "4. Fill the application form\n" +
                       "5. Upload required documents\n" +
                       "6. Submit your application\n\n" +
                       "You'll receive a confirmation and can track status anytime!";
            
            case "CHECK_STATUS":
                return getApplicationStatus(userId);
            
            case "REQUIRED_DOCUMENTS":
                return "📄 Common Required Documents:\n\n" +
                       "• Aadhaar Card\n" +
                       "• Income Certificate\n" +
                       "• Caste Certificate (if applicable)\n" +
                       "• Bank Account Details\n" +
                       "• Educational Certificates\n" +
                       "• Passport Size Photo\n\n" +
                       "Specific documents vary by scheme. Check scheme details for exact requirements.";
            
            case "CONTACT_INFO":
                return "📞 Contact & Support:\n\n" +
                       "• Helpline: 1800-XXX-XXXX\n" +
                       "• Email: support@beneflow.gov.in\n" +
                       "• Office Hours: 9 AM - 6 PM (Mon-Fri)\n\n" +
                       "For technical issues, contact your District Admin.";
            
            default:
                return "I'm not sure I understood that. Could you please rephrase? I can help with:\n" +
                       "• Scheme information\n" +
                       "• Eligibility checks\n" +
                       "• Application process\n" +
                       "• Status tracking";
        }
    }
    
    private String getSchemesList() {
        try {
            if (schemeRepository == null) {
                return "📋 Available Government Schemes:\n\nPlease login to view schemes tailored for you!";
            }
            List<Scheme> schemes = schemeRepository.findAll();
            if (schemes == null || schemes.isEmpty()) {
                return "Currently, no schemes are available. Please check back later.";
            }
            
            StringBuilder response = new StringBuilder("📋 Available Government Schemes:\n\n");
            int count = 0;
            for (Scheme scheme : schemes) {
                if (count >= 5) break;
                response.append("• ").append(scheme.getSchemeName())
                       .append(" (").append(scheme.getSchemeComponent()).append(")\n");
                count++;
            }
            
            if (schemes.size() > 5) {
                response.append("\n...and ").append(schemes.size() - 5).append(" more schemes.");
            }
            
            response.append("\n\nLogin to see schemes you're eligible for!");
            return response.toString();
        } catch (Exception e) {
            return "Unable to fetch schemes at the moment. Please try again later.";
        }
    }
    
    private String getSchemesByCategory(String category) {
        try {
            if (schemeRepository == null) {
                return "Please login to view " + category + " schemes.";
            }
            List<Scheme> allSchemes = schemeRepository.findAll();
            List<Scheme> schemes = new ArrayList<>();
            
            for (Scheme s : allSchemes) {
                if (s.getSchemeComponent() != null && 
                    s.getSchemeComponent().toLowerCase().contains(category.toLowerCase())) {
                    schemes.add(s);
                }
            }
            
            if (schemes.isEmpty()) {
                return "No " + category + " schemes found at the moment. Try asking for 'available schemes'.";
            }
            
            StringBuilder response = new StringBuilder("📚 " + category + " Schemes:\n\n");
            for (Scheme scheme : schemes) {
                response.append("• ").append(scheme.getSchemeName()).append("\n");
            }
            
            return response.toString();
        } catch (Exception e) {
            return "Unable to fetch " + category + " schemes. Please try again.";
        }
    }
    
    private String getEligibilityInfo(Long userId) {
        try {
            if (userRepository == null || userId == null) {
                return "Please login to check your eligibility for specific schemes.";
            }
            
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return "User not found. Please login again.";
            }
            
            User user = userOpt.get();
            int age = calculateAge(user.getDateOfBirth());
            String income = user.getAnnualIncome() != null ? 
                "₹" + user.getAnnualIncome().toString() : "Not provided";
            
            return "✅ Based on your profile:\n\n" +
                   "• Age: " + age + " years\n" +
                   "• Category: " + user.getCasteCategory() + "\n" +
                   "• Income: " + income + "\n\n" +
                   "Visit your dashboard to see schemes you're eligible for!";
        } catch (Exception e) {
            return "Unable to fetch eligibility information. Please try again.";
        }
    }
    
    private String getApplicationStatus(Long userId) {
        try {
            if (applicationRepository == null || userId == null) {
                return "Please login to check your application status.";
            }
            
            List<Application> applications = applicationRepository.findByUserId(userId);
            if (applications == null || applications.isEmpty()) {
                return "You haven't applied to any schemes yet. Browse available schemes and apply!";
            }
            
            StringBuilder response = new StringBuilder("📊 Your Applications:\n\n");
            int count = 0;
            for (Application app : applications) {
                if (count >= 3) break;
                response.append("• ").append(app.getScheme().getSchemeName())
                       .append("\n  Status: ").append(app.getStatus())
                       .append("\n  Applied: ").append(app.getAppliedDate()).append("\n\n");
                count++;
            }
            
            return response.toString();
        } catch (Exception e) {
            return "Unable to fetch application status. Please try again.";
        }
    }
    
    private List<String> getSuggestions(String intent) {
        List<String> suggestions = new ArrayList<>();
        
        switch (intent) {
            case "GREETING":
                suggestions.add("Show available schemes");
                suggestions.add("Check my eligibility");
                suggestions.add("How to apply?");
                break;
            case "LIST_SCHEMES":
                suggestions.add("Education schemes");
                suggestions.add("Health schemes");
                suggestions.add("Check eligibility");
                break;
            case "CHECK_ELIGIBILITY":
                suggestions.add("Show schemes");
                suggestions.add("How to apply?");
                suggestions.add("Required documents");
                break;
            case "HOW_TO_APPLY":
                suggestions.add("Required documents");
                suggestions.add("Check my status");
                suggestions.add("Contact support");
                break;
            default:
                suggestions.add("Show schemes");
                suggestions.add("Check eligibility");
                suggestions.add("Help");
        }
        
        return suggestions;
    }
    
    private int calculateAge(LocalDate birthDate) {
        if (birthDate == null) return 0;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
