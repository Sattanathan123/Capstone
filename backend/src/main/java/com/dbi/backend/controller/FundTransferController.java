package com.dbi.backend.controller;

import com.dbi.backend.entity.FundTransfer;
import com.dbi.backend.service.FundTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fund-transfer")
@CrossOrigin(origins = "http://localhost:3000")
public class FundTransferController {
    
    @Autowired
    private FundTransferService fundTransferService;
    
    @PostMapping("/initiate")
    public ResponseEntity<?> initiateFundTransfer(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            Long applicationId = Long.valueOf(request.get("applicationId").toString());
            String accountNumber = request.get("accountNumber").toString();
            String ifscCode = request.get("ifscCode").toString();
            Double amount = Double.valueOf(request.get("amount").toString());
            
            FundTransfer fundTransfer = fundTransferService.initiateFundTransfer(
                applicationId, accountNumber, ifscCode, amount
            );
            
            return ResponseEntity.ok(fundTransfer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/status/{transferId}")
    public ResponseEntity<?> getTransferStatus(@PathVariable String transferId) {
        try {
            FundTransfer fundTransfer = fundTransferService.getFundTransferByTransferId(transferId);
            return ResponseEntity.ok(fundTransfer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/update-status/{transferId}")
    public ResponseEntity<?> updateTransferStatus(@PathVariable String transferId) {
        try {
            fundTransferService.updateTransferStatus(transferId);
            return ResponseEntity.ok("{\"message\": \"Status updated successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<FundTransfer>> getTransfersByStatus(@PathVariable String status) {
        List<FundTransfer> transfers = fundTransferService.getFundTransfersByStatus(status);
        return ResponseEntity.ok(transfers);
    }
    
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<FundTransfer>> getTransfersByUser(@PathVariable Long userId) {
        List<FundTransfer> transfers = fundTransferService.getFundTransfersByUser(userId);
        return ResponseEntity.ok(transfers);
    }
    
    @PostMapping("/retry/{transferId}")
    public ResponseEntity<?> retryFailedTransfer(@PathVariable String transferId) {
        try {
            fundTransferService.retryFailedTransfer(transferId);
            return ResponseEntity.ok("{\"message\": \"Transfer retry initiated\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getFundTransferDashboard() {
        try {
            List<FundTransfer> initiated = fundTransferService.getFundTransfersByStatus("INITIATED");
            List<FundTransfer> processing = fundTransferService.getFundTransfersByStatus("PROCESSING");
            List<FundTransfer> completed = fundTransferService.getFundTransfersByStatus("COMPLETED");
            List<FundTransfer> failed = fundTransferService.getFundTransfersByStatus("FAILED");
            
            Map<String, Object> dashboard = Map.of(
                "initiated", initiated.size(),
                "processing", processing.size(),
                "completed", completed.size(),
                "failed", failed.size(),
                "recentTransfers", processing.size() > 0 ? processing.subList(0, Math.min(5, processing.size())) : processing
            );
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}