package com.dbi.backend.controller;

import com.dbi.backend.entity.User;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/sysadmin")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemAdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        long totalUsers = userRepository.count();
        long activeUsers = totalUsers; // Can add status field later
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("systemUptime", "99.9%");
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userList = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("fullName", user.getFullName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole().toString());
            userMap.put("status", "ACTIVE");
            userMap.put("registeredDate", user.getCreatedAt());
            userMap.put("mobileNumber", user.getMobileNumber());
            userMap.put("state", user.getState());
            userMap.put("district", user.getDistrict());
            userList.add(userMap);
        }
        
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("id", user.getId());
        userDetails.put("fullName", user.getFullName());
        userDetails.put("email", user.getEmail());
        userDetails.put("mobileNumber", user.getMobileNumber());
        userDetails.put("role", user.getRole().toString());
        userDetails.put("gender", user.getGender());
        userDetails.put("dateOfBirth", user.getDateOfBirth());
        userDetails.put("casteCategory", user.getCasteCategory());
        userDetails.put("address", user.getAddress());
        userDetails.put("state", user.getState());
        userDetails.put("district", user.getDistrict());
        userDetails.put("pincode", user.getPincode());
        userDetails.put("annualIncome", user.getAnnualIncome());
        userDetails.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(userDetails);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        userRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}
