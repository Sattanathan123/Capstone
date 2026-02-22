package com.dbi.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DocumentColumnsInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            System.out.println("=== ADDING DOCUMENT COLUMNS ===");
            
            jdbcTemplate.execute(
                "ALTER TABLE applications " +
                "ADD COLUMN IF NOT EXISTS aadhaar_doc LONGTEXT, " +
                "ADD COLUMN IF NOT EXISTS income_cert_doc LONGTEXT, " +
                "ADD COLUMN IF NOT EXISTS community_cert_doc LONGTEXT, " +
                "ADD COLUMN IF NOT EXISTS occupation_proof_doc LONGTEXT"
            );
            
            System.out.println("Document columns added successfully");
            System.out.println("===============================");
        } catch (Exception e) {
            System.err.println("Error adding document columns: " + e.getMessage());
        }
    }
}
