package com.dbi.backend.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class ApplicationIdGenerator {
    
    private static final Map<String, String> STATE_CODES = new HashMap<>();
    
    static {
        STATE_CODES.put("Tamil Nadu", "TN");
        STATE_CODES.put("Karnataka", "KA");
        STATE_CODES.put("Kerala", "KL");
        STATE_CODES.put("Andhra Pradesh", "AP");
        STATE_CODES.put("Telangana", "TS");
        STATE_CODES.put("Maharashtra", "MH");
        STATE_CODES.put("Gujarat", "GJ");
        STATE_CODES.put("Rajasthan", "RJ");
        STATE_CODES.put("Uttar Pradesh", "UP");
        STATE_CODES.put("Madhya Pradesh", "MP");
        STATE_CODES.put("West Bengal", "WB");
        STATE_CODES.put("Bihar", "BR");
        STATE_CODES.put("Odisha", "OR");
        STATE_CODES.put("Punjab", "PB");
        STATE_CODES.put("Haryana", "HR");
        STATE_CODES.put("Jharkhand", "JH");
        STATE_CODES.put("Chhattisgarh", "CG");
        STATE_CODES.put("Uttarakhand", "UK");
        STATE_CODES.put("Himachal Pradesh", "HP");
        STATE_CODES.put("Assam", "AS");
        STATE_CODES.put("Delhi", "DL");
    }
    
    public String generateApplicationId(String state, Long applicationId) {
        String stateCode = STATE_CODES.getOrDefault(state, "XX");
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yy"));
        String appNumber = String.format("%06d", applicationId);
        return stateCode + year + appNumber;
    }
}
