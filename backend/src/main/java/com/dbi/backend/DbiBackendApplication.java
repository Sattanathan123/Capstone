package com.dbi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DbiBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(DbiBackendApplication.class, args);
        System.out.print("Connection Successful");
    }
}
