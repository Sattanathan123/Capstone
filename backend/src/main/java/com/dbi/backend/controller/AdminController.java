package com.dbi.backend.controller;

import com.dbi.backend.dto.SchemeDTO;
import com.dbi.backend.entity.Scheme;
import com.dbi.backend.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private SchemeService schemeService;
    
    @GetMapping("/schemes")
    public ResponseEntity<?> getAllSchemes(@RequestHeader("Authorization") String token) {
        try {
            List<Scheme> schemes = schemeService.getAllSchemes();
            return ResponseEntity.ok(schemes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/schemes")
    public ResponseEntity<?> createScheme(
            @RequestHeader("Authorization") String token,
            @RequestBody SchemeDTO schemeDTO) {
        try {
            Scheme scheme = schemeService.createScheme(schemeDTO);
            return ResponseEntity.ok(scheme);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<?> deleteScheme(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        try {
            schemeService.deleteScheme(id);
            return ResponseEntity.ok("{\"message\": \"Scheme deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
