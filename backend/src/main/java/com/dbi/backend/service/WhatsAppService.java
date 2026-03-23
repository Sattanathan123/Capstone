package com.dbi.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class WhatsAppService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.whatsapp.from:whatsapp:+14155238886}")
    private String fromNumber;

    private boolean initialized = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() &&
            authToken != null && !authToken.isEmpty()) {
            try {
                Twilio.init(accountSid, authToken);
                initialized = true;
                System.out.println("[WhatsApp] Twilio initialized successfully");
            } catch (Exception e) {
                System.err.println("[WhatsApp] Failed to initialize Twilio: " + e.getMessage());
            }
        } else {
            System.out.println("[WhatsApp] Twilio credentials not configured - WhatsApp notifications disabled");
        }
    }

    public void sendWhatsApp(String toMobile, String message) {
        if (!initialized) {
            System.out.println("[WhatsApp MOCK] To: " + toMobile + " | Message: " + message);
            return;
        }

        try {
            // Format mobile number - add country code if not present
            String formattedNumber = formatMobileNumber(toMobile);

            Message msg = Message.creator(
                new PhoneNumber("whatsapp:" + formattedNumber),
                new PhoneNumber(fromNumber),
                message
            ).create();

            System.out.println("[WhatsApp] Sent to " + formattedNumber + " | SID: " + msg.getSid());
        } catch (Exception e) {
            System.err.println("[WhatsApp] Failed to send to " + toMobile + ": " + e.getMessage());
        }
    }

    public void sendApplicationSubmitted(String mobile, String applicantName, String applicationId, String schemeName) {
        String message = "🎉 *BeniNect - Application Submitted*\n\n" +
                "Hello " + applicantName + ",\n\n" +
                "Your application has been submitted successfully!\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "📌 *Scheme:* " + schemeName + "\n" +
                "📊 *Status:* Under Review\n\n" +
                "We will notify you on every status update.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    public void sendApplicationVerified(String mobile, String applicantName, String applicationId, String schemeName) {
        String message = "✅ *BeniNect - Application Verified*\n\n" +
                "Hello " + applicantName + ",\n\n" +
                "Your application has been verified by the Field Officer!\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "📌 *Scheme:* " + schemeName + "\n" +
                "📊 *Status:* Forwarded for Sanctioning\n\n" +
                "Your application is progressing well.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    public void sendApplicationSanctioned(String mobile, String applicantName, String applicationId, String schemeName, Double amount) {
        String message = "🎊 *BeniNect - Application Sanctioned!*\n\n" +
                "Congratulations " + applicantName + "!\n\n" +
                "Your application has been sanctioned.\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "📌 *Scheme:* " + schemeName + "\n" +
                "💰 *Benefit Amount:* ₹" + (amount != null ? String.format("%.0f", amount) : "As per scheme") + "\n" +
                "📊 *Status:* Sanctioned\n\n" +
                "Fund transfer will be initiated shortly.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    public void sendApplicationRejected(String mobile, String applicantName, String applicationId, String schemeName, String reason) {
        String message = "❌ *BeniNect - Application Update*\n\n" +
                "Hello " + applicantName + ",\n\n" +
                "Unfortunately, your application could not be approved.\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "📌 *Scheme:* " + schemeName + "\n" +
                "📊 *Status:* Rejected\n" +
                "📝 *Reason:* " + (reason != null ? reason : "Does not meet eligibility criteria") + "\n\n" +
                "You may apply for other eligible schemes.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    public void sendFundTransferInitiated(String mobile, String applicantName, String applicationId, Double amount) {
        String message = "💸 *BeniNect - Fund Transfer Initiated*\n\n" +
                "Hello " + applicantName + ",\n\n" +
                "Fund transfer has been initiated to your bank account.\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "💰 *Amount:* ₹" + String.format("%.0f", amount) + "\n" +
                "📊 *Status:* Processing\n\n" +
                "Amount will be credited within 2-3 working days.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    public void sendFundTransferCompleted(String mobile, String applicantName, String applicationId, Double amount) {
        String message = "✅ *BeniNect - Amount Credited!*\n\n" +
                "Hello " + applicantName + ",\n\n" +
                "₹" + String.format("%.0f", amount) + " has been credited to your bank account!\n\n" +
                "📋 *Application ID:* " + applicationId + "\n" +
                "💰 *Amount Credited:* ₹" + String.format("%.0f", amount) + "\n" +
                "📊 *Status:* Completed\n\n" +
                "Thank you for using BeniNect.\n\n" +
                "_BeniNect - Empowering Citizens_";
        sendWhatsApp(mobile, message);
    }

    private String formatMobileNumber(String mobile) {
        if (mobile == null) return "";
        mobile = mobile.replaceAll("[^0-9]", "");
        if (mobile.length() == 10) {
            return "+91" + mobile;
        }
        if (!mobile.startsWith("+")) {
            return "+" + mobile;
        }
        return mobile;
    }
}
