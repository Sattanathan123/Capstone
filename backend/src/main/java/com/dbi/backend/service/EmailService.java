package com.dbi.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("abcd");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("[EMAIL SENT] To: " + to);
        } catch (Exception e) {
            System.err.println("[EMAIL FAILED] To: " + to + " | Error: " + e.getMessage());
        }
    }

    /** Stage 1 — notify field officer that a new application needs verification */
    public void sendVerificationRequestEmail(String officerEmail, String officerName,
                                              String appId, String schemeName,
                                              String beneficiaryName, String district) {
        sendEmail(officerEmail,
            "📋 New Application Pending Verification – " + appId,
            "Dear " + officerName + ",\n\n" +
            "A new scheme application has been submitted and requires your field verification.\n\n" +
            "Application ID : " + appId + "\n" +
            "Scheme         : " + schemeName + "\n" +
            "Beneficiary    : " + beneficiaryName + "\n" +
            "District       : " + district + "\n\n" +
            "Please log in to the Field Officer Dashboard and complete the verification at the earliest.\n\n" +
            "Regards,\nDBI Scheme Management System");
    }

    /** Stage 2 — notify sanctioning authority that a verified application awaits sanction */
    public void sendSanctionRequestEmail(String authorityEmail, String authorityName,
                                          String appId, String schemeName,
                                          String beneficiaryName, String district) {
        sendEmail(authorityEmail,
            "✅ Application Verified – Awaiting Your Sanction – " + appId,
            "Dear " + authorityName + ",\n\n" +
            "The following application has been verified by the Field Officer and is now pending your sanction.\n\n" +
            "Application ID : " + appId + "\n" +
            "Scheme         : " + schemeName + "\n" +
            "Beneficiary    : " + beneficiaryName + "\n" +
            "District       : " + district + "\n\n" +
            "Please log in to the Sanctioning Authority Dashboard to review and sanction the application.\n\n" +
            "Regards,\nDBI Scheme Management System");
    }

    /** Stage 3 — notify beneficiary of final sanction/rejection outcome */
    public void sendSanctionOutcomeEmail(String beneficiaryEmail, String beneficiaryName,
                                          String appId, String schemeName,
                                          boolean sanctioned, Double amount, String reason) {
        if (sanctioned) {
            sendEmail(beneficiaryEmail,
                "🎉 Congratulations! Application " + appId + " Sanctioned",
                "Dear " + beneficiaryName + ",\n\n" +
                "We are pleased to inform you that your application has been sanctioned.\n\n" +
                "Application ID : " + appId + "\n" +
                "Scheme         : " + schemeName + "\n" +
                "Sanctioned Amt : ₹" + String.format("%,.0f", amount) + "\n\n" +
                "The benefit amount will be disbursed to your registered bank account shortly.\n\n" +
                "Regards,\nDBI Scheme Management System");
        } else {
            sendEmail(beneficiaryEmail,
                "❌ Application " + appId + " Rejected by Sanctioning Authority",
                "Dear " + beneficiaryName + ",\n\n" +
                "We regret to inform you that your application has been rejected by the Sanctioning Authority.\n\n" +
                "Application ID : " + appId + "\n" +
                "Scheme         : " + schemeName + "\n" +
                "Reason         : " + reason + "\n\n" +
                "If you have any queries, please contact your district office.\n\n" +
                "Regards,\nDBI Scheme Management System");
        }
    }
}
