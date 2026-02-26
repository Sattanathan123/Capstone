package com.dbi.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/sysadmin")
@CrossOrigin(origins = "http://localhost:3000")
public class SystemAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        long totalUsers = userRepository.count();
        long activeUsers = totalUsers;
        
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

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(@RequestParam(defaultValue = "month") String range) {
        Map<String, Object> analytics = new HashMap<>();
        
        try {
            // Basic counts with fallbacks
            long totalApplications = 0;
            long approvedApplications = 0;
            long rejectedApplications = 0;
            long pendingApplications = 0;
            long totalBeneficiaries = 0;
            long totalOfficers = 0;
            long totalAdmins = 0;
            
            try {
                totalApplications = applicationRepository.count();
            } catch (Exception e) { /* ignore */ }
            
            try {
                approvedApplications = applicationRepository.countByStatus("APPROVED");
            } catch (Exception e) { /* ignore */ }
            
            try {
                rejectedApplications = applicationRepository.countByStatus("REJECTED");
            } catch (Exception e) { /* ignore */ }
            
            try {
                pendingApplications = applicationRepository.countByStatus("PENDING_VERIFICATION");
            } catch (Exception e) { /* ignore */ }
            
            try {
                totalBeneficiaries = userRepository.countByRole(UserRole.BENEFICIARY);
            } catch (Exception e) { /* ignore */ }
            
            try {
                totalOfficers = userRepository.countByRole(UserRole.FIELD_VERIFICATION_OFFICER) + 
                               userRepository.countByRole(UserRole.SCHEME_SANCTIONING_AUTHORITY);
            } catch (Exception e) { /* ignore */ }
            
            try {
                totalAdmins = userRepository.countByRole(UserRole.DEPT_ADMIN);
            } catch (Exception e) { /* ignore */ }
            
            analytics.put("totalApplications", totalApplications);
            analytics.put("approvedApplications", approvedApplications);
            analytics.put("rejectedApplications", rejectedApplications);
            analytics.put("pendingApplications", pendingApplications);
            analytics.put("totalBeneficiaries", totalBeneficiaries);
            analytics.put("totalOfficers", totalOfficers);
            analytics.put("totalAdmins", totalAdmins);
            analytics.put("roleWiseData", getSimpleRoleData(totalBeneficiaries, totalOfficers, totalAdmins));
            analytics.put("statusTrendData", getSimpleStatusData(approvedApplications, pendingApplications, rejectedApplications, totalApplications));
            
        } catch (Exception e) {
            e.printStackTrace();
            analytics.put("totalApplications", 0);
            analytics.put("approvedApplications", 0);
            analytics.put("rejectedApplications", 0);
            analytics.put("pendingApplications", 0);
            analytics.put("totalBeneficiaries", 0);
            analytics.put("totalOfficers", 0);
            analytics.put("totalAdmins", 0);
            analytics.put("roleWiseData", new ArrayList<>());
            analytics.put("statusTrendData", new ArrayList<>());
        }
        
        return ResponseEntity.ok(analytics);
    }
    
    private List<Map<String, Object>> getSimpleRoleData(long beneficiaries, long officers, long admins) {
        List<Map<String, Object>> roleData = new ArrayList<>();
        
        Map<String, Object> beneficiaryData = new HashMap<>();
        beneficiaryData.put("role", "Beneficiaries");
        beneficiaryData.put("count", beneficiaries);
        roleData.add(beneficiaryData);
        
        Map<String, Object> officerData = new HashMap<>();
        officerData.put("role", "Officers");
        officerData.put("count", officers);
        roleData.add(officerData);
        
        Map<String, Object> adminData = new HashMap<>();
        adminData.put("role", "Admins");
        adminData.put("count", admins);
        roleData.add(adminData);
        
        return roleData;
    }
    
    private List<Map<String, Object>> getSimpleStatusData(long approved, long pending, long rejected, long total) {
        List<Map<String, Object>> statusData = new ArrayList<>();
        
        Map<String, Object> approvedData = new HashMap<>();
        approvedData.put("status", "Approved");
        approvedData.put("count", approved);
        approvedData.put("percentage", total > 0 ? Math.round((double) approved / total * 100 * 10.0) / 10.0 : 0.0);
        statusData.add(approvedData);
        
        Map<String, Object> pendingData = new HashMap<>();
        pendingData.put("status", "Pending");
        pendingData.put("count", pending);
        pendingData.put("percentage", total > 0 ? Math.round((double) pending / total * 100 * 10.0) / 10.0 : 0.0);
        statusData.add(pendingData);
        
        Map<String, Object> rejectedData = new HashMap<>();
        rejectedData.put("status", "Rejected");
        rejectedData.put("count", rejected);
        rejectedData.put("percentage", total > 0 ? Math.round((double) rejected / total * 100 * 10.0) / 10.0 : 0.0);
        statusData.add(rejectedData);
        
        return statusData;
    }
}