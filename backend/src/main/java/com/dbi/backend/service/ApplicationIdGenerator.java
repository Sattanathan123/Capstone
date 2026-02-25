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
        // States
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
        STATE_CODES.put("Goa", "GA");
        STATE_CODES.put("Manipur", "MN");
        STATE_CODES.put("Meghalaya", "ML");
        STATE_CODES.put("Mizoram", "MZ");
        STATE_CODES.put("Nagaland", "NL");
        STATE_CODES.put("Sikkim", "SK");
        STATE_CODES.put("Tripura", "TR");
        STATE_CODES.put("Arunachal Pradesh", "AR");
        
        // Union Territories
        STATE_CODES.put("Delhi", "DL");
        STATE_CODES.put("Puducherry", "PY");
        STATE_CODES.put("Chandigarh", "CH");
        STATE_CODES.put("Andaman and Nicobar Islands", "AN");
        STATE_CODES.put("Dadra and Nagar Haveli and Daman and Diu", "DD");
        STATE_CODES.put("Lakshadweep", "LD");
        STATE_CODES.put("Ladakh", "LA");
        STATE_CODES.put("Jammu and Kashmir", "JK");
    }
    
    public String generateApplicationId(String state, Long applicationId) {
        String stateCode = STATE_CODES.getOrDefault(state, "XX");
        String year = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yy"));
        String appNumber = String.format("%06d", applicationId);
        return stateCode + year + appNumber;
    }
}
