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
            
            for (String col : new String[]{"aadhaar_doc", "income_cert_doc", "community_cert_doc", "occupation_proof_doc"}) {
                int count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = ?",
                    Integer.class, col);
                if (count == 0) {
                    jdbcTemplate.execute("ALTER TABLE applications ADD COLUMN " + col + " LONGTEXT");
                }
            }
            
            System.out.println("Document columns added successfully");
            System.out.println("===============================");
        } catch (Exception e) {
            System.err.println("Error adding document columns: " + e.getMessage());
        }
    }
}
