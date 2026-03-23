package com.dbi.backend.controller;

import com.dbi.backend.entity.AuditLog;
import com.dbi.backend.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:3000")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getLogs(
            @RequestParam(required = false) Long applicationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        if (applicationId != null) {
            return ResponseEntity.ok(auditLogRepository.findByApplicationIdOrderByPerformedAtDesc(applicationId));
        }
        if (from != null && to != null) {
            return ResponseEntity.ok(auditLogRepository.findByPerformedAtBetweenOrderByPerformedAtDesc(
                from.atStartOfDay(), to.plusDays(1).atStartOfDay()));
        }
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByPerformedAtDesc());
    }
}
