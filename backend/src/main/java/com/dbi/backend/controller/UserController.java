package com.dbi.backend.controller;

import com.dbi.backend.dto.LoginDTO;
import com.dbi.backend.dto.LoginResponseDTO;
import com.dbi.backend.dto.UserRegistrationDTO;
import com.dbi.backend.entity.User;
import com.dbi.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000", "http://localhost:3001"})
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO dto) {
        try {
            User user = userService.registerUser(dto);
            return ResponseEntity.ok().body("{\"message\": \"Registration successful\", \"userId\": " + user.getId() + "}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO dto) {
        try {
            LoginResponseDTO response = userService.loginUser(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            String decoded = new String(java.util.Base64.getDecoder().decode(cleanToken));
            Long userId = Long.parseLong(decoded.split(":")[0]);
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid token\"}");
        }
    }
}
