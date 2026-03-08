package com.dbi.backend.service;

import com.dbi.backend.entity.Application;
import com.dbi.backend.entity.FundTransfer;
import com.dbi.backend.repository.ApplicationRepository;
import com.dbi.backend.repository.FundTransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FundTransferService {
    
    @Autowired
    private FundTransferRepository fundTransferRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private BankAPIService bankAPIService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Transactional
    public FundTransfer initiateFundTransfer(Long applicationId, String accountNumber, String ifscCode, Double amount) throws Exception {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new Exception("Application not found"));
        
        if (!"SANCTIONED".equals(application.getStatus())) {
            throw new Exception("Application must be sanctioned before fund transfer");
        }
        
        // Check if transfer already exists
        List<FundTransfer> existingTransfers = fundTransferRepository.findByApplicationId(applicationId);
        if (!existingTransfers.isEmpty()) {
            throw new Exception("Fund transfer already initiated for this application");
        }
        
        // Generate transfer ID
        String transferId = "FT" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
        
        // Create fund transfer record
        FundTransfer fundTransfer = new FundTransfer();
        fundTransfer.setApplication(application);
        fundTransfer.setTransferId(transferId);
        fundTransfer.setAmount(amount);
        fundTransfer.setBeneficiaryAccount(accountNumber);
        fundTransfer.setBeneficiaryIfsc(ifscCode);
        fundTransfer.setStatus("INITIATED");
        fundTransfer.setInitiatedDate(LocalDateTime.now());
        fundTransfer.setRemarks("Fund transfer initiated");
        
        fundTransfer = fundTransferRepository.save(fundTransfer);
        
        // Initiate bank transfer
        try {
            BankAPIService.BankTransferResult result = bankAPIService.initiateTransfer(
                accountNumber, ifscCode, amount, "Scheme benefit disbursement"
            );
            
            if (result.isSuccess()) {
                fundTransfer.setBankReference(result.getBankReference());
                fundTransfer.setStatus("PROCESSING");
                fundTransfer.setRemarks("Transfer initiated with bank");
            } else {
                fundTransfer.setStatus("FAILED");
                fundTransfer.setRemarks("Bank transfer failed: " + result.getMessage());
            }
            
            fundTransfer = fundTransferRepository.save(fundTransfer);
            
            // Send notification
            notificationService.createNotification(
                application.getUser().getId(),
                "Fund transfer of ₹" + amount + " has been initiated for your application " + application.getApplicationId(),
                "FUND_TRANSFER_INITIATED",
                application.getId()
            );
            
        } catch (Exception e) {
            fundTransfer.setStatus("FAILED");
            fundTransfer.setRemarks("Error initiating transfer: " + e.getMessage());
            fundTransferRepository.save(fundTransfer);
            throw e;
        }
        
        return fundTransfer;
    }
    
    @Transactional
    public void updateTransferStatus(String transferId) throws Exception {
        FundTransfer fundTransfer = fundTransferRepository.findByTransferId(transferId)
            .orElseThrow(() -> new Exception("Fund transfer not found"));
        
        if ("PROCESSING".equals(fundTransfer.getStatus()) && fundTransfer.getBankReference() != null) {
            BankAPIService.BankTransferStatus status = bankAPIService.checkTransferStatus(fundTransfer.getBankReference());
            
            String oldStatus = fundTransfer.getStatus();
            fundTransfer.setStatus(status.getStatus());
            
            if ("COMPLETED".equals(status.getStatus())) {
                fundTransfer.setCompletedDate(LocalDateTime.now());
                fundTransfer.setRemarks("Fund transfer completed successfully");
                
                // Update application status
                Application application = fundTransfer.getApplication();
                application.setStatus("FUND_DISBURSED");
                applicationRepository.save(application);
                
                // Send completion notification
                notificationService.createNotification(
                    application.getUser().getId(),
                    "Fund transfer of ₹" + fundTransfer.getAmount() + " has been completed successfully. Amount credited to your account.",
                    "FUND_TRANSFER_COMPLETED",
                    application.getId()
                );
                
            } else if ("FAILED".equals(status.getStatus())) {
                fundTransfer.setRemarks("Fund transfer failed: " + status.getMessage());
                fundTransfer.setRetryCount(fundTransfer.getRetryCount() + 1);
            }
            
            fundTransferRepository.save(fundTransfer);
        }
    }
    
    public List<FundTransfer> getFundTransfersByStatus(String status) {
        return fundTransferRepository.findByStatus(status);
    }
    
    public List<FundTransfer> getFundTransfersByUser(Long userId) {
        return fundTransferRepository.findByUserId(userId);
    }
    
    public FundTransfer getFundTransferByTransferId(String transferId) throws Exception {
        return fundTransferRepository.findByTransferId(transferId)
            .orElseThrow(() -> new Exception("Fund transfer not found"));
    }
    
    @Transactional
    public void retryFailedTransfer(String transferId) throws Exception {
        FundTransfer fundTransfer = fundTransferRepository.findByTransferId(transferId)
            .orElseThrow(() -> new Exception("Fund transfer not found"));
        
        if (!"FAILED".equals(fundTransfer.getStatus())) {
            throw new Exception("Only failed transfers can be retried");
        }
        
        if (fundTransfer.getRetryCount() >= 3) {
            throw new Exception("Maximum retry attempts exceeded");
        }
        
        // Retry bank transfer
        BankAPIService.BankTransferResult result = bankAPIService.initiateTransfer(
            fundTransfer.getBeneficiaryAccount(),
            fundTransfer.getBeneficiaryIfsc(),
            fundTransfer.getAmount(),
            "Scheme benefit disbursement - Retry"
        );
        
        if (result.isSuccess()) {
            fundTransfer.setBankReference(result.getBankReference());
            fundTransfer.setStatus("PROCESSING");
            fundTransfer.setRemarks("Transfer retried successfully");
        } else {
            fundTransfer.setRemarks("Retry failed: " + result.getMessage());
        }
        
        fundTransfer.setRetryCount(fundTransfer.getRetryCount() + 1);
        fundTransferRepository.save(fundTransfer);
    }
}