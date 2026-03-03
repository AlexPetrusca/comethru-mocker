# Comethru Mocker - Implementation Summary

## Overview
SMS mocking service for development environments. Simulates SMS communication without calling external providers like Twilio. Designed to run in Kubernetes and be accessed via port-forward or ingress.

---

## Tech Stack
- **Framework:** Spring Boot 4.0.3
- **Language:** Java 25
- **Database:** H2
- **Build:** Maven

---

## Dependencies Added
| Dependency | Purpose |
|------------|---------|
| `spring-boot-starter-data-jpa` | Database ORM |
| `spring-boot-starter-web` | REST API |
| `h2` | In-memory database |

---

## Database Configuration
- **URL:** `jdbc:h2:mem:mockerdb`
- **Console:** `http://localhost:8080/h2-console`
- **DDL:** `create-drop` (auto-creates tables on startup)
- **Dialect:** H2Dialect

---

## API Endpoints

### Messages API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/messages/send` | Send SMS from one number to another |
| `GET` | `/messages` | Get all messages |
| `GET` | `/messages/recipient/{to}` | Get messages received by a number |
| `GET` | `/messages/sender/{from}` | Get messages sent from a number |
| `GET` | `/messages/between?from=&to=` | Get conversation between two numbers |
| `DELETE` | `/messages/{id}` | Delete a message by ID |

**Request Body (POST /messages/send):**
```json
{
  "from": "+1234567890",
  "to": "+0987654321",
  "body": "Hello"
}
```

### Verification Codes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/verification/send` | Generate and send 6-digit verification code |
| `POST` | `/verification/verify` | Verify a code |
| `GET` | `/verification/recipient/{to}` | Get verification codes for a number |

**Request Body (POST /verification/send):**
```json
{
  "to": "+1234567890"
}
```

**Request Body (POST /verification/verify):**
```json
{
  "to": "+1234567890",
  "code": "123456"
}
```

**Verification Code Behavior:**
- Generates random 6-digit code
- Expires after 10 minutes
- Sends SMS from `777777` with body: `"Your Comethru verification code is: <code>"`
- Codes can only be used once

---

## Database Tables

### `messages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `from_number` | varchar | Sender phone number |
| `to_number` | varchar | Recipient phone number |
| `body` | varchar(1600) | Message content |
| `sent_at` | timestamp | When message was sent |

### `verification_codes`
| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `to_number` | varchar | Recipient phone number |
| `code` | varchar(10) | 6-digit verification code |
| `created_at` | timestamp | When code was generated |
| `expires_at` | timestamp | Code expiration time |
| `verified` | boolean | Whether code has been used |

---

## Project Structure
```
backend/
├── pom.xml
├── src/main/java/com/comethru/mocker/
│   ├── ComethruMockerApplication.java
│   ├── controller/
│   │   ├── MessageController.java
│   │   └── VerificationCodeController.java
│   ├── entity/
│   │   ├── Message.java
│   │   └── VerificationCode.java
│   ├── repository/
│   │   ├── MessageRepository.java
│   │   └── VerificationCodeRepository.java
│   └── service/
│       ├── MessageService.java
│       └── VerificationCodeService.java
├── src/main/resources/
│   └── application.yaml
└── postman-collection.json
```

---

## Testing

### Postman Collection
Import `postman-collection.json` into Postman to test all endpoints.

Base URL variable: `http://localhost:8080`

---

## Future Work (Planned)

1. **Phone Client Simulator**
   - CLI or GUI client that connects to the service
   - Pretend to be a phone with a given number
   - Open multiple instances to simulate inter-phone communication

2. **Kubernetes Deployment**
   - Docker image
   - Helm charts or K8s manifests
   - Configure main app to route SMS through mock service in dev

3. **Additional Features**
   - Message delivery delays
   - Configurable failure scenarios
   - Message status tracking (sent, delivered, failed)
   - Webhook callbacks for incoming messages

---

## Running the Application

```bash
cd backend
mvn spring-boot:run
```

Access points:
- **API:** `http://localhost:8090`
