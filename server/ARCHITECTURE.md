# Architecture Overview

This project follows the **MVC (Model-View-Controller)** architecture pattern with an additional **Service Layer** for better separation of concerns.

## Architecture Layers

### 1. **Routes Layer** (`/routes/`)
- **Purpose**: Define API endpoints and HTTP methods
- **Responsibility**: Route requests to appropriate controllers
- **Files**: `auth.js`, `user.js`

### 2. **Controllers Layer** (`/controllers/`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibility**: 
  - Validate request data
  - Call appropriate services
  - Format responses
  - Handle HTTP status codes
- **Files**: `authController.js`, `userController.js`

### 3. **Services Layer** (`/services/`)
- **Purpose**: Contain business logic
- **Responsibility**:
  - Implement core business rules
  - Handle data processing
  - Interact with models
  - Manage transactions
- **Files**: `authService.js`, `userService.js`

### 4. **Models Layer** (`/models/`)
- **Purpose**: Define data structure and database operations
- **Responsibility**:
  - Define schemas
  - Handle data validation
  - Provide database methods
  - Manage data relationships
- **Files**: `User.js`

### 5. **Middleware Layer** (`/middleware/`)
- **Purpose**: Handle cross-cutting concerns
- **Responsibility**:
  - Authentication/Authorization
  - Input validation
  - Error handling
  - Logging
- **Files**: `auth.js`, `validation.js`

## Data Flow

```
HTTP Request → Routes → Controllers → Services → Models → Database
                     ↓
HTTP Response ← Routes ← Controllers ← Services ← Models ← Database
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to modify and extend
3. **Testability**: Each layer can be tested independently
4. **Reusability**: Services can be reused across different controllers
5. **Scalability**: Easy to add new features without affecting existing code

## Example Flow: User Registration

1. **Route** (`/routes/auth.js`): `POST /api/auth/register`
2. **Validation** (`/middleware/validation.js`): Validate email and password
3. **Controller** (`/controllers/authController.js`): Handle request/response
4. **Service** (`/services/authService.js`): Check if user exists, hash password
5. **Model** (`/models/User.js`): Save user to database
6. **Response**: Return user data and JWT token

## Error Handling Strategy

- **Controllers**: Handle HTTP-specific errors and format responses
- **Services**: Handle business logic errors and throw custom error types
- **Models**: Handle database validation errors
- **Middleware**: Handle authentication and validation errors

## Security Considerations

- Passwords are hashed in the model layer using bcrypt
- JWT tokens are generated and verified in the middleware
- Input validation happens at multiple layers
- Error messages are sanitized to prevent information leakage
