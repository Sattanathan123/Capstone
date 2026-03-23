package com.dbi.backend.service;

import com.dbi.backend.entity.User;
import org.springframework.stereotype.Service;

@Service
public class PriorityCalculator {

    /**
     * Scoring rules:
     *  SC/ST community  → +40
     *  OBC              → +20
     *  Income ≤ 50,000  → +30
     *  Income ≤ 1,00,000→ +15
     *  Female           → +20
     *  Disabled         → +20  (incomeSource contains "disabled" / "differently")
     *
     *  Score ≥ 60 → High
     *  Score ≥ 30 → Medium
     *  else       → Low
     */
    public String calculate(User user) {
        int score = 0;

        String caste = user.getCasteCategory() != null ? user.getCasteCategory().toUpperCase() : "";
        if (caste.equals("SC") || caste.equals("ST")) score += 40;
        else if (caste.equals("OBC"))                  score += 20;

        Double income = user.getAnnualIncome();
        if (income != null) {
            if (income <= 50_000)  score += 30;
            else if (income <= 1_00_000) score += 15;
        }

        String gender = user.getGender() != null ? user.getGender().toUpperCase() : "";
        if (gender.equals("FEMALE") || gender.equals("F")) score += 20;

        String incomeSource = user.getIncomeSource() != null ? user.getIncomeSource().toLowerCase() : "";
        if (incomeSource.contains("disabled") || incomeSource.contains("differently")) score += 20;

        if (score >= 60) return "High";
        if (score >= 30) return "Medium";
        return "Low";
    }
}
