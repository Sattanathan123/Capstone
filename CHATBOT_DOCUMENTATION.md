# Chatbot Assistance Module - Documentation

## Overview
AI-powered chatbot assistant integrated into Beneflow to help users with scheme information, eligibility checks, and application guidance.

## Features

### 1. **Intent Detection**
- GREETING - Welcome messages
- LIST_SCHEMES - Show available schemes
- EDUCATION_SCHEMES - Education-specific schemes
- HEALTH_SCHEMES - Health-specific schemes
- AGRICULTURE_SCHEMES - Agriculture-specific schemes
- CHECK_ELIGIBILITY - User eligibility information
- HOW_TO_APPLY - Application process guidance
- CHECK_STATUS - Application status tracking
- REQUIRED_DOCUMENTS - Document requirements
- CONTACT_INFO - Support contact details

### 2. **NLP Keyword Detection**
The chatbot uses keyword matching to understand user intent:
- "scheme", "program", "yojana" → Scheme queries
- "eligible", "eligibility", "qualify" → Eligibility checks
- "apply", "application", "how to" → Application guidance
- "status", "track" → Status tracking
- "document", "required" → Document information

### 3. **Integration with Existing Modules**
- **Scheme Repository** - Fetches real-time scheme data
- **Application Repository** - Retrieves application status
- **User Repository** - Accesses user profile for personalized responses
- **Smart Validation Engine** - Uses eligibility rules

### 4. **Chat Logging**
All interactions are logged in `chat_logs` table for:
- Analytics and improvement
- User behavior tracking
- Intent accuracy measurement

## API Endpoints

### POST /api/chatbot/message
Send a message to the chatbot

**Request:**
```json
{
  "message": "Show education schemes",
  "userId": 123,
  "sessionId": "session_1234567890"
}
```

**Response:**
```json
{
  "response": "📚 Education Schemes:\n\n• Scholarship Scheme\n• Student Aid Program",
  "intent": "EDUCATION_SCHEMES",
  "suggestions": ["Check eligibility", "How to apply?", "Required documents"]
}
```

### GET /api/chatbot/session/{sessionId}
Retrieve chat history for a session

## Frontend Usage

### Import and Use
```jsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div>
      <Chatbot />
      {/* Your other components */}
    </div>
  );
}
```

### Features
- **Floating Widget** - Always accessible from bottom-right
- **Real-time Responses** - Instant bot replies
- **Suggestion Chips** - Quick action buttons
- **Typing Indicator** - Shows bot is processing
- **Session Management** - Maintains conversation context
- **Responsive Design** - Works on mobile and desktop

## Database Schema

### chat_logs Table
```sql
CREATE TABLE chat_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    user_message VARCHAR(1000),
    bot_response VARCHAR(2000),
    intent VARCHAR(50),
    session_id VARCHAR(100),
    timestamp DATETIME NOT NULL
);
```

## Sample Queries

### User Queries the Bot Can Handle:
1. "Show me available schemes"
2. "Am I eligible for scholarship?"
3. "How do I apply for a scheme?"
4. "What documents do I need?"
5. "Check my application status"
6. "Show education schemes"
7. "Contact support"
8. "Help me"

## Customization

### Adding New Intents
1. Add intent detection in `ChatbotService.detectIntent()`
2. Add response generation in `ChatbotService.generateResponse()`
3. Add suggestions in `ChatbotService.getSuggestions()`

### Example:
```java
if (msg.contains("payment") || msg.contains("fund transfer"))
    return "PAYMENT_INFO";

case "PAYMENT_INFO":
    return "Payment information...";
```

## Analytics

### Track Chatbot Performance
```sql
-- Most common intents
SELECT intent, COUNT(*) as count 
FROM chat_logs 
GROUP BY intent 
ORDER BY count DESC;

-- User engagement
SELECT user_id, COUNT(*) as interactions 
FROM chat_logs 
WHERE user_id IS NOT NULL 
GROUP BY user_id;

-- Unknown queries (for improvement)
SELECT user_message 
FROM chat_logs 
WHERE intent = 'UNKNOWN';
```

## Future Enhancements
1. Machine Learning integration for better NLP
2. Multi-language support
3. Voice input/output
4. Rich media responses (images, videos)
5. Sentiment analysis
6. Proactive notifications

## Troubleshooting

### Chatbot not responding
- Check backend is running on port 8080
- Verify database connection
- Check browser console for errors

### Incorrect responses
- Review intent detection keywords
- Check database has scheme data
- Verify user is logged in for personalized responses

## Support
For issues or enhancements, contact the development team.
