package com.dbi.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDTO {
    private String schemeName;
    private String schemeDescription;
    private String schemeComponent;
    private String status;
    private Double minIncome;
    private Double maxIncome;
    private String community;
    private String occupation;
    private String benefitType;
    private Double maxBenefitAmount;
    private String applicationStartDate;
    private String applicationEndDate;
    private Boolean requiresAadhaar;
    private Boolean requiresIncomeCertificate;
    private Boolean requiresCommunityCertificate;
    private Boolean requiresOccupationProof;
}
