package com.dbi.backend.dto;

import com.dbi.backend.entity.Scheme;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryEligibleSchemesDTO {
    private BeneficiaryProfileDTO beneficiary;
    private List<Scheme> eligibleSchemes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BeneficiaryProfileDTO {
        private String fullName;
        private Double annualIncome;
        private String casteCategory;
        private String incomeSource;
    }
}
