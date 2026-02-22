# DBI System - Complete Application Workflow

## Application Status Flow

```
PENDING_VERIFICATION → APPROVED/REJECTED → SANCTIONED/REJECTED → DISBURSED
```

## District-Based Routing

### How Applications are Routed:
1. **Beneficiary submits application** from Coimbatore district
2. **System automatically routes** to Field Officer assigned to Coimbatore
3. **Field Officer sees only** applications from their assigned district
4. **Sanctioning Officer sees only** approved applications from their assigned district

### Matching Logic:
- Application uses `user.district` (beneficiary's district from profile)
- Field Officer has `assignedDistrict` (e.g., "Coimbatore")
- System matches: `app.user.district == officer.assignedDistrict`
- If officer has no assigned district, they see ALL applications

## Detailed Workflow

### 1. Beneficiary Submits Application
- **Status**: `PENDING_VERIFICATION`
- **Action**: User fills form and uploads documents
- **Stored**: Application details, documents (base64)

### 2. Field Verification Officer Reviews
- **Sees**: Applications in their assigned district with status `PENDING_VERIFICATION`
- **Can View**: 
  - Beneficiary details
  - All uploaded documents (Aadhaar, Income Cert, Community Cert, Occupation Proof)
  - Application information
- **Actions**: 
  - Approve → Status changes to `APPROVED`
  - Reject → Status changes to `REJECTED`
- **Stores**: 
  - `verificationRemarks` - Field officer's remarks
  - `verificationOfficerId` - Officer who verified
  - `verifiedDate` - Verification timestamp

### 3. Sanctioning Officer Reviews (Only APPROVED applications)
- **Sees**: Applications with status `APPROVED` in their assigned district
- **Can View**:
  - All beneficiary details
  - All uploaded documents
  - **Field Verification Remarks** (from Field Officer)
  - Application information
- **Actions**:
  - Sanction → Status changes to `SANCTIONED`
  - Reject → Status changes to `REJECTED`
- **Stores**:
  - `remarks` - Sanctioning officer's remarks
  - `sanctioningOfficerId` - Officer who sanctioned
  - `sanctionedDate` - Sanction timestamp

### 4. Beneficiary Tracks Application
- **Journey Map Shows**:
  1. ✅ Submitted
  2. 🔍 Field Verification (PENDING_VERIFICATION)
  3. ✅ Sanctioning (APPROVED - waiting for sanction)
  4. 💰 Distribution in Progress (SANCTIONED)
  5. 💰 Disbursed (DISBURSED)

## Database Fields

### Application Entity
- `id` - Primary key
- `applicationId` - Unique application ID
- `userId` - Beneficiary reference
- `schemeId` - Scheme reference
- `status` - Current status
- `appliedDate` - Submission date
- `verificationRemarks` - Field officer remarks
- `verificationOfficerId` - Field officer ID
- `verifiedDate` - Verification date
- `remarks` - Sanctioning officer remarks
- `sanctioningOfficerId` - Sanctioning officer ID
- `sanctionedDate` - Sanction date
- `aadhaarDoc` - Base64 document
- `incomeCertDoc` - Base64 document
- `communityCertDoc` - Base64 document
- `occupationProofDoc` - Base64 document

## API Endpoints

### Field Officer
- `GET /api/officer/all-verifications` - Get all applications (pending + verified by officer)
- `GET /api/officer/stats` - Get statistics
- `GET /api/officer/application/{id}` - Get application details
- `POST /api/officer/verify/{id}` - Approve/Reject application

### Sanctioning Officer
- `GET /api/sanctioning/applications` - Get all applications (approved + sanctioned by officer)
- `GET /api/sanctioning/stats` - Get statistics
- `GET /api/sanctioning/application/{id}` - Get application details
- `POST /api/sanctioning/sanction/{id}` - Sanction/Reject application

### Beneficiary
- `GET /api/beneficiary/eligible-schemes` - Get eligible schemes
- `GET /api/beneficiary/applications` - Track applications
- `POST /api/beneficiary/apply` - Submit application

## Status Display

### For Beneficiary
- `PENDING_VERIFICATION` → "Field Verification in Progress"
- `APPROVED` → "Sanctioning in Progress"
- `SANCTIONED` → "Distribution in Progress"
- `REJECTED` → "Rejected" (with remarks)
- `DISBURSED` → "Disbursed"

### For Field Officer
- `PENDING_VERIFICATION` → Shows in "Pending" tab
- `APPROVED` → Shows in "Approved" tab
- `REJECTED` → Shows in "Rejected" tab

### For Sanctioning Officer
- `APPROVED` → Shows in "Pending Sanction" tab
- `SANCTIONED` → Shows in "Sanctioned" tab
- `REJECTED` → Shows in "Rejected" tab


## Example Scenario

### User from Coimbatore submits application:

1. **Beneficiary Profile**:
   - Name: Raj Kumar
   - District: **Coimbatore**
   - State: Tamil Nadu

2. **Application Submission**:
   - Applies for "PM Kisan Scheme"
   - Status: `PENDING_VERIFICATION`
   - Stored with user's district: **Coimbatore**

3. **Field Officer Assignment**:
   - Officer Name: Priya Sharma
   - Assigned District: **Coimbatore**
   - Sees: Raj's application (district match)

4. **Another Officer**:
   - Officer Name: Amit Patel
   - Assigned District: **Chennai**
   - Does NOT see: Raj's application (district mismatch)

5. **After Field Verification**:
   - Priya approves → Status: `APPROVED`
   - Moves to Sanctioning Officer in **Coimbatore**

6. **Sanctioning Officer**:
   - Officer Name: Dr. Sundar
   - Assigned District: **Coimbatore**
   - Sees: Raj's approved application
   - Can view Priya's verification remarks
   - Sanctions → Status: `SANCTIONED`

7. **Beneficiary Dashboard**:
   - Raj sees: "Distribution in Progress"

## Key Points

✅ **Automatic Routing**: Applications automatically go to officers in the same district
✅ **No Manual Assignment**: System uses district matching
✅ **Privacy**: Officers only see applications from their district
✅ **Scalability**: Multiple officers can be assigned to same district
✅ **Fallback**: Officers with no assigned district see all applications (for testing/admin)
