# Mobile API Authentication Plan for EduTime

## Overview
Create a comprehensive mobile-friendly API authentication system with Swagger documentation based on your existing NextAuth setup.

## 📋 Current System Analysis

### Existing Infrastructure:
- NextAuth.js v4 with Prisma adapter
- JWT sessions with bcrypt password hashing
- Email verification system
- Role-based access control (5 user roles)
- Validation schemas with Zod
- Google OAuth + email/password auth

### Mobile Requirements Identified:
- RESTful API endpoints (independent of web session flow)
- JWT-based authentication (stateless for mobile)
- Refresh token mechanism
- Device management capabilities
- Mobile-specific error responses
- Comprehensive API documentation

---

## 🏗️ API Architecture Design

### 1. Mobile Authentication Endpoints

```
/api/mobile/v1/auth/
├── register          - User registration
├── login             - Email/password login
├── google            - Google OAuth login
├── refresh-token     - Refresh access token
├── logout            - Logout user
├── verify-email      - Email verification
├── resend-verification - Resend verification email
├── forgot-password   - Password reset request
├── reset-password    - Password reset confirmation
└── me               - Get current user profile
```

### 2. JWT Token Strategy

**Access Token:** 15 minutes expiration
- Contains user ID, role, permissions
- Used for API calls
- Stateless verification

**Refresh Token:** 7 days expiration
- Stored securely in mobile app
- Used to obtain new access tokens
- Device-specific tracking

**Token Structure:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "TEACHER",
    "verified": true
  }
}
```

---

## 📚 Swagger Documentation Setup

### 1. Dependencies to Add
```json
{
  "swagger-ui-react": "^5.0.0",
  "swagger-jsdoc": "^6.2.8",
  "@types/swagger-jsdoc": "^6.0.4",
  "@types/swagger-ui-react": "^4.18.3"
}
```

### 2. Swagger Configuration
- OpenAPI 3.0 specification
- Bearer token authentication
- Request/response schemas
- Error documentation
- Interactive API testing interface

---

## 🛠️ Implementation Roadmap

### Phase 1: Core Infrastructure (Priority: High)

#### 1.1 JWT Token Management
- Create custom JWT service
- Implement token generation/validation
- Build refresh token mechanism
- Add device tracking

**Files to create:**
- `src/lib/mobile-jwt.ts` - JWT token service
- `src/lib/mobile-auth.ts` - Mobile auth utilities
- `src/lib/refresh-token.ts` - Refresh token management

#### 1.2 Mobile Authentication Routes
- Create mobile-specific API routes
- Implement registration/login endpoints
- Add email verification for mobile
- Build password reset flow

**Files to create:**
- `src/app/api/mobile/v1/auth/register/route.ts`
- `src/app/api/mobile/v1/auth/login/route.ts`
- `src/app/api/mobile/v1/auth/refresh-token/route.ts`
- `src/app/api/mobile/v1/auth/google/route.ts`
- `src/app/api/mobile/v1/auth/logout/route.ts`
- `src/app/api/mobile/v1/auth/me/route.ts`

#### 1.3 Mobile Validation Schemas
- Extend existing Zod schemas
- Add mobile-specific validations
- Create request/response type definitions

**Files to create:**
- `src/lib/validations/mobile-auth.ts`
- `src/types/mobile-api.ts`

### Phase 2: Security & Middleware (Priority: High)

#### 2.1 Mobile Authentication Middleware
- JWT validation middleware
- Rate limiting for mobile endpoints
- Device management
- Security headers

**Files to create:**
- `src/middleware/mobile-auth.ts`
- `src/lib/rate-limiting.ts`
- `src/lib/device-management.ts`

#### 2.2 Error Handling
- Standardized error responses
- Mobile-friendly error format
- Logging and monitoring

**Files to create:**
- `src/lib/mobile-errors.ts`
- `src/lib/api-response.ts`

### Phase 3: API Documentation (Priority: Medium)

#### 3.1 Swagger Setup
- OpenAPI configuration
- Schema definitions
- Authentication documentation

**Files to create:**
- `src/lib/swagger.ts`
- `src/app/api/docs/route.ts` - Swagger UI endpoint
- `src/app/api/mobile/v1/openapi.yaml` - OpenAPI spec

#### 3.2 API Documentation
- Endpoint documentation
- Request/response examples
- Authentication flow documentation

### Phase 4: Additional Features (Priority: Low)

#### 4.1 Device Management
- Multiple device support
- Device-specific sessions
- Remote logout capabilities

#### 4.2 Analytics & Monitoring
- API usage tracking
- Authentication metrics
- Error monitoring integration

---

## 📁 File Structure

```
src/
├── lib/
│   ├── mobile-jwt.ts              # JWT token service
│   ├── mobile-auth.ts             # Mobile auth utilities
│   ├── refresh-token.ts           # Refresh token management
│   ├── mobile-errors.ts           # Error handling
│   ├── api-response.ts            # Standardized responses
│   ├── rate-limiting.ts           # Rate limiting
│   ├── device-management.ts       # Device tracking
│   ├── swagger.ts                 # Swagger configuration
│   └── validations/
│       ├── mobile-auth.ts         # Mobile validation schemas
│       └── index.ts               # Update existing schemas
├── types/
│   └── mobile-api.ts              # Mobile API types
├── middleware/
│   └── mobile-auth.ts             # Mobile auth middleware
├── app/api/
│   ├── docs/
│   │   └── route.ts               # Swagger UI
│   ├── mobile/
│   │   └── v1/
│   │       └── auth/
│   │           ├── register/route.ts
│   │           ├── login/route.ts
│   │           ├── google/route.ts
│   │           ├── refresh-token/route.ts
│   │           ├── logout/route.ts
│   │           ├── verify-email/route.ts
│   │           ├── forgot-password/route.ts
│   │           ├── reset-password/route.ts
│   │           └── me/route.ts
│   └── mobile/
│       └── v1/
│           └── openapi.yaml       # OpenAPI specification
```

---

## 🔧 Implementation Steps

### Step 1: Install Dependencies
```bash
npm install swagger-ui-react swagger-jsdoc @types/swagger-jsdoc @types/swagger-ui-react jsonwebtoken @types/jsonwebtoken
```

### Step 2: Create JWT Service
- Custom JWT implementation
- Token generation and validation
- Refresh token mechanism

### Step 3: Build API Endpoints
- Registration endpoint with validation
- Login with email/password
- Google OAuth integration
- Token refresh endpoint

### Step 4: Add Middleware
- Authentication middleware
- Rate limiting
- Error handling

### Step 5: Implement Swagger
- OpenAPI configuration
- Documentation generation
- Interactive UI

### Step 6: Testing & Validation
- API testing with Swagger UI
- Mobile app integration testing
- Security testing

---

## 📊 Expected Deliverables

1. **Complete Mobile API** - 10 authentication endpoints
2. **JWT Token System** - Secure access/refresh token flow
3. **Swagger Documentation** - Interactive API documentation
4. **Security Features** - Rate limiting, device management, error handling
5. **Type Safety** - Full TypeScript implementation
6. **Testing Tools** - API testing interface

## ⏱️ Timeline Estimate

- **Phase 1 (Core Infrastructure):** 3-4 days
- **Phase 2 (Security & Middleware):** 2-3 days
- **Phase 3 (API Documentation):** 1-2 days
- **Phase 4 (Additional Features):** 2-3 days

**Total Estimated Time:** 8-12 days

---

## 🔐 Security Considerations

### JWT Security
- Use strong secret keys
- Implement proper token expiration
- Secure refresh token storage
- Token blacklist on logout

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration for mobile domains
- HTTPS enforcement
- Request size limits

### Data Protection
- Hash passwords with bcrypt (12 rounds)
- Secure email verification tokens
- Device fingerprinting
- Audit logging for authentication events

---

## 📱 Mobile Integration Guidelines

### Authentication Flow
1. **Registration:** Mobile app → API → Email verification → Login
2. **Login:** Credentials → API → JWT tokens → Secure storage
3. **Token Refresh:** Auto-refresh when access token expires
4. **Logout:** Clear local tokens + API call to invalidate

### Error Handling
- Standardized error codes
- User-friendly error messages
- Network error handling
- Token expiration handling

### Best Practices
- Store tokens in secure mobile storage
- Implement biometric authentication
- Handle network connectivity issues
- Provide offline authentication where possible