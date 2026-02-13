# DBI Backend - Setup Guide

## Database Configuration

### MySQL Setup
1. **Install MySQL** (if not installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Default port: 3306

2. **Create Database**
   ```sql
   CREATE DATABASE dbi_database;
   ```

3. **Update Credentials** (if different from default)
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

## Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| full_name | VARCHAR(255) | NOT NULL |
| gender | VARCHAR(50) | NOT NULL |
| date_of_birth | DATE | NOT NULL |
| mobile_number | VARCHAR(10) | UNIQUE, NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| caste_category | VARCHAR(50) | NOT NULL |
| caste_certificate_number | VARCHAR(255) | |
| aadhaar_number_hash | VARCHAR(255) | UNIQUE, NOT NULL (SHA-256 Hashed) |
| state | VARCHAR(100) | NOT NULL |
| district | VARCHAR(100) | NOT NULL |
| block | VARCHAR(100) | |
| village | VARCHAR(100) | |
| pincode | VARCHAR(6) | NOT NULL |
| annual_income | DOUBLE | |
| income_source | VARCHAR(100) | |
| role | ENUM | NOT NULL (BENEFICIARY, FIELD_OFFICER, DISTRICT_ADMIN, STATE_ADMIN) |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | |

## Running the Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run Spring Boot Application**
   ```bash
   mvnw spring-boot:run
   ```
   Or in IDE: Run `BackendApplication.java`

3. **Verify Server**
   - Server runs on: http://localhost:8080
   - Test endpoint: http://localhost:8080/api/users/register

## API Endpoints

### POST /api/users/register
Register a new user

**Request Body:**
```json
{
  "fullName": "John Doe",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "casteCategory": "SC",
  "casteCertificateNumber": "SC123456",
  "aadhaarNumber": "123456789012",
  "state": "Karnataka",
  "district": "Bangalore",
  "block": "North",
  "village": "Village Name",
  "pincode": "560001",
  "annualIncome": 50000,
  "incomeSource": "Agriculture",
  "role": "BENEFICIARY"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "userId": 1
}
```

## Security Features

1. **Aadhaar Hashing**: Aadhaar numbers are hashed using SHA-256 before storage
2. **CORS Enabled**: Frontend (localhost:3000) can access the API
3. **Unique Constraints**: Mobile number and Aadhaar hash must be unique

## Testing

### Using Postman
1. Create POST request to: http://localhost:8080/api/users/register
2. Set Headers: `Content-Type: application/json`
3. Add request body (see above)
4. Send request

### Using cURL
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "gender": "Male",
    "dateOfBirth": "1995-05-15",
    "mobileNumber": "9999999999",
    "aadhaarNumber": "999999999999",
    "casteCategory": "SC",
    "state": "Delhi",
    "district": "Central",
    "pincode": "110001",
    "role": "BENEFICIARY"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Change port in application.properties
server.port=8081
```

### Database Connection Error
- Verify MySQL is running
- Check username/password in application.properties
- Ensure database exists

### Lombok Not Working
```bash
# Rebuild project
mvnw clean install
```

## Project Structure
```
backend/
├── src/main/java/com/dbi/backend/
│   ├── entity/
│   │   ├── User.java
│   │   └── UserRole.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── service/
│   │   └── UserService.java
│   ├── controller/
│   │   └── UserController.java
│   └── dto/
│       └── UserRegistrationDTO.java
└── src/main/resources/
    └── application.properties
```
