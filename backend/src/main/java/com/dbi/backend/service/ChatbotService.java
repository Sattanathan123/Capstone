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
            
            // Add action for eligibility intent when user is logged in
            if ("CHECK_ELIGIBILITY".equals(intent) && userId != null) {
                result.put("action", "SHOW_ELIGIBLE_SCHEMES");
                result.put("actionLabel", "View Eligible Schemes in Dashboard");
            }
            
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
        String msg = message.toLowerCase().trim();
        
        if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.equals("start"))
            return "GREETING";
        
        if (msg.contains("eligible") || msg.contains("eligibility") || msg.contains("qualify") || msg.contains("check my"))
            return "CHECK_ELIGIBILITY";
        
        if (msg.contains("status") || msg.contains("track") || msg.contains("my application"))
            return "CHECK_STATUS";
        
        if (msg.contains("apply") || msg.contains("how to"))
            return "HOW_TO_APPLY";
        
        if (msg.contains("document") || msg.contains("required") || msg.contains("what do i need"))
            return "REQUIRED_DOCUMENTS";
        
        if (msg.contains("contact") || msg.contains("support") || msg.contains("helpline"))
            return "CONTACT_INFO";
        
        if (msg.contains("scheme") || msg.contains("program") || msg.contains("yojana") || msg.contains("show") || msg.contains("list") || msg.contains("available")) {
            if (msg.contains("education") || msg.contains("scholarship") || msg.contains("student"))
                return "EDUCATION_SCHEMES";
            if (msg.contains("health") || msg.contains("medical"))
                return "HEALTH_SCHEMES";
            if (msg.contains("agriculture") || msg.contains("farmer"))
                return "AGRICULTURE_SCHEMES";
            return "LIST_SCHEMES";
        }
        
        if (msg.contains("help"))
            return "CONTACT_INFO";
        
        return "UNKNOWN";
    }
    
    private String generateResponse(String intent, String message, Long userId) {
        switch (intent) {
            case "GREETING":
                return "Hello! 👋 I'm your BeniNect assistant. I can help you with:\n" +
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
                       "• Email: support@beninect.gov.in\n" +
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
            
            StringBuilder response = new StringBuilder("📋 Available Government Schemes (" + schemes.size() + " total):\n\n");
            int count = 0;
            for (Scheme scheme : schemes) {
                if (count >= 8) break;
                String component = (scheme.getSchemeComponent() != null && !scheme.getSchemeComponent().isEmpty())
                    ? " - " + scheme.getSchemeComponent() : "";
                String benefit = scheme.getMaxBenefitAmount() != null
                    ? " | ₹" + scheme.getMaxBenefitAmount().longValue() : "";
                response.append("• ").append(scheme.getSchemeName())
                       .append(component)
                       .append(benefit)
                       .append("\n");
                count++;
            }
            
            if (schemes.size() > 8) {
                response.append("\n...and ").append(schemes.size() - 8).append(" more schemes.");
            }
            
            response.append("\n\nAsk me about Education, Health or Agriculture schemes for more details!");
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Unable to fetch schemes at the moment. Error: " + e.getMessage();
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
                String comp = s.getSchemeComponent() != null ? s.getSchemeComponent().toLowerCase() : "";
                String name = s.getSchemeName() != null ? s.getSchemeName().toLowerCase() : "";
                String desc = s.getSchemeDescription() != null ? s.getSchemeDescription().toLowerCase() : "";
                if (comp.contains(category.toLowerCase()) || name.contains(category.toLowerCase()) || desc.contains(category.toLowerCase())) {
                    schemes.add(s);
                }
            }
            
            if (schemes.isEmpty()) {
                // Show all schemes if no category match
                return "No specific " + category + " schemes found.\n\nHere are all available schemes:\n" + getSchemesList();
            }
            
            StringBuilder response = new StringBuilder("📚 " + category + " Schemes (" + schemes.size() + " found):\n\n");
            for (Scheme scheme : schemes) {
                String benefit = scheme.getMaxBenefitAmount() != null
                    ? " | Benefit: ₹" + scheme.getMaxBenefitAmount().longValue() : "";
                response.append("• ").append(scheme.getSchemeName()).append(benefit).append("\n");
            }
            
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Unable to fetch " + category + " schemes. Error: " + e.getMessage();
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
            
            // Get eligible schemes count
            List<Scheme> allSchemes = schemeRepository != null ? schemeRepository.findAll() : new ArrayList<>();
            List<Application> userApps = applicationRepository != null ? applicationRepository.findByUserId(userId) : new ArrayList<>();
            List<Long> appliedIds = new ArrayList<>();
            for (Application app : userApps) {
                if (!"REJECTED".equals(app.getStatus())) {
                    appliedIds.add(app.getScheme().getId());
                }
            }
            long eligibleCount = allSchemes.stream().filter(s -> !appliedIds.contains(s.getId())).count();
            
            return "✅ Based on your profile:\n\n" +
                   "• Name: " + user.getFullName() + "\n" +
                   "• Age: " + age + " years\n" +
                   "• Category: " + user.getCasteCategory() + "\n" +
                   "• Income: " + income + "\n" +
                   "• Eligible Schemes: " + eligibleCount + "\n\n" +
                   "👉 Click below to view your eligible schemes in the dashboard!";
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
