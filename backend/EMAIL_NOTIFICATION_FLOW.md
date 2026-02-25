# Email Notification Flow

## Overview
The system now sends automated emails to users at every stage of their scheme application process.

## Email Notifications

### 1. Application Submission
**Trigger:** When user applies for a scheme  
**Subject:** "Application Submitted Successfully"  
**Message:** "Your application for [Scheme Name] has been submitted successfully. Application ID: [APP_ID]. Your application will be reviewed by the field verification officer of [District] district."

### 2. Field Officer Verification - APPROVED
**Trigger:** When field officer approves the application  
**Subject:** "Application Verified - Forwarded for Approval"  
**Message:** "Good news! Your application [APP_ID] for [Scheme Name] has been verified by the field officer and forwarded to the sanctioning authority for final approval."

### 3. Field Officer Verification - REJECTED
**Trigger:** When field officer rejects the application  
**Subject:** "Application Status Update"  
**Message:** "Your application [APP_ID] for [Scheme Name] has been rejected by the field officer. Reason: [Remarks]"

### 4. Sanctioning Authority - SANCTIONED
**Trigger:** When sanctioning authority approves the application  
**Subject:** "Congratulations! Application Sanctioned"  
**Message:** "Congratulations! Your application [APP_ID] for [Scheme Name] has been sanctioned. Approved amount: ₹[Amount]. The benefits will be disbursed to your account shortly."

### 5. Sanctioning Authority - REJECTED
**Trigger:** When sanctioning authority rejects the application  
**Subject:** "Application Status Update"  
**Message:** "Your application [APP_ID] for [Scheme Name] has been rejected by the sanctioning authority. Reason: [Remarks]"

## Technical Implementation

### Components
- **EmailService**: Handles SMTP email sending via Gmail
- **NotificationService**: Creates notifications and triggers emails
- **BeneficiarySchemeService**: Sends email on application submission
- **FieldOfficerController**: Sends email on verification
- **SanctioningAuthorityController**: Sends email on sanctioning

### Configuration
SMTP settings are configured in `application.properties`:
- Host: smtp.gmail.com
- Port: 587 (TLS)
- Authentication: Required
- Email: sample@gmail.com

### Database
All notifications are stored in the `notifications` table with:
- id, userId, title, message, type, isRead, applicationId, createdAt

## District-Based Routing
Applications are automatically routed to field officers and sanctioning authorities based on the user's district (assignedDistrict field).
