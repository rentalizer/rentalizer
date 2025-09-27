# Rentalizer Backend API

A complete user authentication system built with Node.js, Express.js, MongoDB, and JWT using MVC architecture.

## Features

- User registration with email and password
- User login with JWT token generation
- Protected routes with JWT middleware
- Password hashing with bcrypt
- Input validation with express-validator
- MongoDB integration with Mongoose
- MVC architecture with Controllers and Services
- Comprehensive error handling
- Profile management endpoints

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### User Profile

#### GET /api/user/profile
Get user profile (Protected route).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/user/profile
Update user profile (Protected route).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/user/change-password
Change user password (Protected route).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### DELETE /api/user/account
Delete user account (Protected route).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "password": "CurrentPass123"
}
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

## Project Structure

```
server/
├── controllers/          # Request handlers (MVC Controllers)
│   ├── authController.js # Authentication endpoints
│   └── userController.js # User profile endpoints
├── services/            # Business logic layer
│   ├── authService.js   # Authentication business logic
│   └── userService.js   # User management business logic
├── models/              # Database models
│   └── User.js          # User schema and methods
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   └── user.js          # User profile routes
├── index.js             # Main server file
├── test-auth.js         # Test script
└── README.md            # Documentation
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   - Set your MongoDB connection string
   - Set a secure JWT secret
   - Configure port if needed

4. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: Environment (development/production)

## Testing the API

You can test the API using tools like Postman, curl, or any HTTP client.

### Example curl commands:

**Register a user:**
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

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

**Get profile (replace TOKEN with actual JWT):**
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer TOKEN"
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 24 hours
- Input validation on all endpoints
- CORS enabled for cross-origin requests
- Error handling with appropriate HTTP status codes
- Password is never returned in API responses
