# Digital Beneficiary Identification (DBI) System

A comprehensive web application for managing government welfare schemes and beneficiary applications with role-based access control.

## 🎯 Project Overview

The Digital Beneficiary Identification System is designed to streamline the process of identifying eligible beneficiaries for government welfare schemes. It provides a secure platform for beneficiaries to apply for schemes and for administrators to manage applications efficiently.

## ✨ Features

### For Beneficiaries
- **User Registration & Login** - Secure authentication with Aadhaar and mobile verification
- **Eligible Schemes Discovery** - View schemes based on income, community, and occupation
- **Application Submission** - Apply for schemes with document upload
- **Application Tracking** - Real-time journey map showing application status
  - Submitted → Under Review → Approved/Rejected → Disbursed
- **Profile Management** - View and manage personal details

### For Administrators
- **Multi-Role Support** - Department Admin, System Admin, Field Officer, etc.
- **Application Management** - Review and process beneficiary applications
- **Scheme Management** - Create and manage welfare schemes
- **Dashboard Analytics** - View statistics and reports

## 🛠️ Technology Stack

### Frontend
- **React** 19.2.4
- **React Router** 7.13.0
- **Framer Motion** 12.34.0 (animations)
- **CSS3** (custom styling)

### Backend
- **Spring Boot** 4.0.2
- **Java** 17
- **Spring Data JPA** (database operations)
- **MySQL** (database)
- **Lombok** (code generation)

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Java JDK** 17+
- **MySQL** 8.0+
- **Maven** 3.6+

## 🚀 Installation & Setup

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE dbi;

-- Use database
USE dbi;

-- Insert sample schemes
INSERT INTO schemes (scheme_name, scheme_description, scheme_component, status, min_income, max_income, community, occupation, benefit_type, max_benefit_amount, application_start_date, application_end_date, created_at, updated_at) VALUES
('Post Matric Scholarship', 'Education support for students from economically weaker sections', 'SCHOLARSHIP', 'ACTIVE', 50000, 200000, 'ALL', 'ALL', 'FINANCIAL', 50000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('Agriculture Support Scheme', 'Financial assistance for small and marginal farmers', 'AGRICULTURE', 'ACTIVE', 50000, 200000, 'ALL', 'ALL', 'FINANCIAL', 75000, '2024-01-01', '2025-12-31', NOW(), NOW()),
('OBC Welfare Scheme', 'Development scheme for OBC category beneficiaries', 'SCHOLARSHIP', 'ACTIVE', 50000, 200000, 'OBC', 'ALL', 'FINANCIAL', 60000, '2024-01-01', '2025-12-31', NOW(), NOW());
```

### 2. Backend Setup

```bash
cd backend

# Update application.properties with your MySQL credentials
# File: src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/dbi
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will start on: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on: `http://localhost:3000` or `http://localhost:4000`

## 📁 Project Structure

```
Capstone/
├── backend/
│   ├── src/main/java/com/dbi/backend/
│   │   ├── config/          # CORS and security configuration
│   │   ├── controller/      # REST API endpoints
│   │   ├── entity/          # Database entities
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic
│   │   └── dto/             # Data transfer objects
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/           # Admin components
│       ├── beneficiary/     # Beneficiary components
│       ├── components/      # Shared components
│       └── pages/           # Page components
└── README.md
```

## 🔐 User Roles

1. **BENEFICIARY** - Apply for schemes and track applications
2. **DEPT_ADMIN** - Department level administration
3. **SYSTEM_ADMIN** - System-wide administration
4. **FIELD_VERIFICATION_OFFICER** - Field verification tasks
5. **MONITORING_AUDIT_OFFICER** - Monitoring and auditing
6. **SCHEME_SANCTIONING_AUTHORITY** - Approve/reject applications

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Beneficiary
- `GET /api/beneficiary/eligible-schemes` - Get eligible schemes
- `GET /api/beneficiary/applications` - Get user applications
- `POST /api/beneficiary/apply/{schemeId}` - Apply for scheme

### Admin
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/application/{id}/status` - Update application status

## 🎨 Key Features Implementation

### Application Tracking Journey Map
- Visual progress indicator with 4 stages
- Color-coded status badges
- Real-time status updates
- Responsive design for mobile

### Eligibility Matching
- Income-based filtering (₹50,000 - ₹2,00,000)
- Community-based matching (SC/ST/OBC/General)
- Occupation-based filtering
- Automatic scheme recommendations

### Security Features
- Token-based authentication
- CORS protection
- Role-based access control
- Secure password handling

## 🧪 Testing

### Sample Test User
```
Mobile: 1234567890
Aadhaar: 123456789012
Password: test123
Role: BENEFICIARY
Income: ₹1,00,000
Community: OBC
```

## 📝 Configuration Files

### Backend - application.properties
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/dbi
spring.jpa.hibernate.ddl-auto=update
```

### Frontend - Package.json
```json
{
  "proxy": "http://localhost:8080"
}
```

## 🐛 Troubleshooting

### CORS Error
- Ensure backend CORS configuration includes frontend port
- Check `CorsConfig.java` has correct origins

### Database Connection Error
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database `dbi` exists

### Schemes Not Showing
- Run the sample schemes SQL script
- Check scheme eligibility criteria matches user profile
- Verify schemes have `status='ACTIVE'`

## 📄 License

This project is developed for educational purposes.

## 👥 Contributors

- Development Team - Digital Beneficiary Identification System

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Note**: This is a capstone project demonstrating full-stack development with Spring Boot and React.
