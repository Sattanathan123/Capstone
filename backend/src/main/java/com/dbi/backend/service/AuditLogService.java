package com.dbi.backend.service;

import com.dbi.backend.entity.AuditLog;
import com.dbi.backend.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(Long applicationId, String applicationRef, String schemeName,
                    String beneficiaryName, String action,
                    String previousStatus, String newStatus,
                    Long performedById, String performedByName, String performedByRole,
                    String remarks) {
        AuditLog log = new AuditLog();
        log.setApplicationId(applicationId);
        log.setApplicationRef(applicationRef);
        log.setSchemeName(schemeName);
        log.setBeneficiaryName(beneficiaryName);
        log.setAction(action);
        log.setPreviousStatus(previousStatus);
        log.setNewStatus(newStatus);
        log.setPerformedById(performedById);
        log.setPerformedByName(performedByName);
        log.setPerformedByRole(performedByRole);
        log.setRemarks(remarks);
        auditLogRepository.save(log);
    }
}
