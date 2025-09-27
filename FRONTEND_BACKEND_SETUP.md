# Frontend-Backend Integration Setup Guide

This guide will help you connect your React frontend to the Node.js backend authentication system.

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create environment file:**
   ```bash
   # Create .env file with the following content:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rentalizer
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-rentalizer-2024
   NODE_ENV=development
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Install axios (if not already installed):**
   ```bash
   npm install axios
   ```

2. **Create environment file (optional):**
   ```bash
   # Create .env file in the root directory:
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start the frontend:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### API Configuration

The frontend is configured to connect to your backend through:

- **API Service**: `src/services/api.ts` - Handles all HTTP requests
- **Configuration**: `src/config/api.ts` - Centralized API settings
- **Auth Context**: `src/contexts/AuthContext.tsx` - Updated to use real backend

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rentalizer` |
| `JWT_SECRET` | JWT signing secret | Required |

## 🔐 Authentication Flow

### 1. User Registration
```typescript
// Frontend calls
await signUp(email, password, { firstName, lastName });

// Backend processes
POST /api/auth/register
- Validates input
- Hashes password
- Creates user in MongoDB
- Returns JWT token
```

### 2. User Login
```typescript
// Frontend calls
await signIn(email, password);

// Backend processes
POST /api/auth/login
- Validates credentials
- Compares password hash
- Returns JWT token
```

### 3. Protected Routes
```typescript
// Frontend automatically includes token
Authorization: Bearer <jwt_token>

// Backend validates
GET /api/user/profile
- Verifies JWT token
- Returns user data
```

## 🧪 Testing the Integration

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### 4. Test Frontend Integration
1. Open your React app
2. Navigate to `/auth/signup`
3. Create a new account
4. Check browser console for success messages
5. Navigate to `/auth/login`
6. Sign in with your credentials

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is enabled
   - Check that frontend URL is allowed

2. **Connection Refused**
   - Verify backend server is running on port 5000
   - Check firewall settings

3. **Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET is set correctly

4. **MongoDB Connection**
   - Ensure MongoDB is running
   - Verify connection string in .env

### Debug Steps

1. **Check Backend Logs:**
   ```bash
   cd server
   npm run dev
   # Look for connection and error messages
   ```

2. **Check Frontend Console:**
   - Open browser DevTools
   - Look for network requests and errors

3. **Test API Endpoints:**
   ```bash
   # Test health endpoint
   curl http://localhost:5000/api/health
   ```

## 📁 File Structure

```
src/
├── services/
│   └── api.ts              # API service with axios
├── contexts/
│   └── AuthContext.tsx     # Updated auth context
├── config/
│   └── api.ts              # API configuration
├── utils/
│   └── authHelpers.ts      # Auth helper functions
└── components/
    └── AuthTest.tsx        # Test component

server/
├── controllers/            # Request handlers
├── services/              # Business logic
├── models/                # Database models
├── middleware/            # Auth & validation
├── routes/                # API routes
└── index.js               # Server entry point
```

## 🚀 Next Steps

1. **Test the complete flow:**
   - Register a new user
   - Login with credentials
   - Access protected routes
   - Update profile
   - Change password

2. **Add error handling:**
   - Network error handling
   - User-friendly error messages
   - Loading states

3. **Enhance security:**
   - Token refresh mechanism
   - Secure token storage
   - Input sanitization

4. **Add features:**
   - Password reset
   - Email verification
   - User roles and permissions

## 📞 Support

If you encounter issues:

1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Test API endpoints directly with curl/Postman
5. Check network connectivity between frontend and backend

The integration is now complete and ready for testing! 🎉
