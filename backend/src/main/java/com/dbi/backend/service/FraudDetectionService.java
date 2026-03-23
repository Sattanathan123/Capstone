package com.dbi.backend.service;

import com.dbi.backend.entity.User;
import com.dbi.backend.entity.UserRole;
import com.dbi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FraudDetectionService {

    @Autowired
    private UserRepository userRepository;

    /** Called by SystemAdmin dashboard — returns all current fraud alerts */
    public List<Map<String, Object>> getFraudAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        List<User> beneficiaries = userRepository.findByRole(UserRole.BENEFICIARY);
        alerts.addAll(detectDuplicateBankAccounts(beneficiaries));
        alerts.addAll(detectIncomeMismatch(beneficiaries));
        return alerts;
    }

    /**
     * Called at application submission time.
     * Returns a list of fraud reasons for this specific user.
     * Empty list = no fraud detected.
     */
    public List<String> checkApplicationFraud(User user) {
        List<String> reasons = new ArrayList<>();

        // Check 1: duplicate bank account
        if (user.getBankAccountNumber() != null && !user.getBankAccountNumber().isBlank()) {
            long count = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(user.getId())
                    && user.getBankAccountNumber().equals(u.getBankAccountNumber()))
                .count();
            if (count > 0)
                reasons.add("Bank account " + mask(user.getBankAccountNumber()) +
                        " is already registered with another user");
        }

        // Check 2: income mismatch
        String caste = user.getCasteCategory() != null ? user.getCasteCategory().toUpperCase() : "";
        Double income = user.getAnnualIncome();
        if ((caste.equals("SC") || caste.equals("ST") || caste.equals("OBC"))
                && income != null && income > 500_000)
            reasons.add("Declared income ₹" + String.format("%,.0f", income) +
                    " is unusually high for " + caste + " category");

        return reasons;
    }

    /** Bulk check for dashboard */
    private List<Map<String, Object>> detectDuplicateBankAccounts(List<User> users) {
        Map<String, List<User>> byAccount = users.stream()
            .filter(u -> u.getBankAccountNumber() != null && !u.getBankAccountNumber().isBlank())
            .collect(Collectors.groupingBy(User::getBankAccountNumber));

        List<Map<String, Object>> alerts = new ArrayList<>();
        byAccount.forEach((account, group) -> {
            if (group.size() > 1) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("type", "DUPLICATE_BANK_ACCOUNT");
                alert.put("severity", "HIGH");
                alert.put("message", "Bank account " + mask(account) + " is shared by " + group.size() + " users");
                alert.put("users", group.stream()
                    .map(u -> Map.of("id", u.getId(), "name", u.getFullName(), "mobile", u.getMobileNumber()))
                    .collect(Collectors.toList()));
                alerts.add(alert);
            }
        });
        return alerts;
    }

    private List<Map<String, Object>> detectIncomeMismatch(List<User> users) {
        List<Map<String, Object>> alerts = new ArrayList<>();
        for (User u : users) {
            String caste = u.getCasteCategory() != null ? u.getCasteCategory().toUpperCase() : "";
            Double income = u.getAnnualIncome();
            if ((caste.equals("SC") || caste.equals("ST") || caste.equals("OBC"))
                    && income != null && income > 500_000) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("type", "INCOME_MISMATCH");
                alert.put("severity", "MEDIUM");
                alert.put("message", u.getFullName() + " (" + caste + ") declared income ₹" +
                        String.format("%,.0f", income) + " — unusually high for reserved category");
                alert.put("users", List.of(
                    Map.of("id", u.getId(), "name", u.getFullName(), "mobile", u.getMobileNumber())
                ));
                alerts.add(alert);
            }
        }
        return alerts;
    }

    private String mask(String account) {
        if (account.length() <= 4) return "****";
        return "*".repeat(account.length() - 4) + account.substring(account.length() - 4);
    }
}
