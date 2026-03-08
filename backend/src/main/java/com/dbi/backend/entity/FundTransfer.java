package com.dbi.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_transfers")
public class FundTransfer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;
    
    @Column(name = "transfer_id", unique = true)
    private String transferId;
    
    @Column(name = "amount")
    private Double amount;
    
    @Column(name = "beneficiary_account")
    private String beneficiaryAccount;
    
    @Column(name = "beneficiary_ifsc")
    private String beneficiaryIfsc;
    
    @Column(name = "bank_reference")
    private String bankReference;
    
    @Column(name = "status")
    private String status; // INITIATED, PROCESSING, COMPLETED, FAILED
    
    @Column(name = "initiated_date")
    private LocalDateTime initiatedDate;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "retry_count")
    private Integer retryCount = 0;

    // Constructors
    public FundTransfer() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public String getTransferId() { return transferId; }
    public void setTransferId(String transferId) { this.transferId = transferId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getBeneficiaryAccount() { return beneficiaryAccount; }
    public void setBeneficiaryAccount(String beneficiaryAccount) { this.beneficiaryAccount = beneficiaryAccount; }

    public String getBeneficiaryIfsc() { return beneficiaryIfsc; }
    public void setBeneficiaryIfsc(String beneficiaryIfsc) { this.beneficiaryIfsc = beneficiaryIfsc; }

    public String getBankReference() { return bankReference; }
    public void setBankReference(String bankReference) { this.bankReference = bankReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getInitiatedDate() { return initiatedDate; }
    public void setInitiatedDate(LocalDateTime initiatedDate) { this.initiatedDate = initiatedDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }
}