---
title: "Adding JWTs to a Fastify Server"
description: "A live session walkthrough of how to add JWTs to a Fastify server, covering practical implementation steps and best practices for JWT authentication."
date: "2024-08-15"
updateDate: ""
tags: ["fastify", "jwt", "authentication", "nodejs", "live-coding"]
draft: true
youtubeId: "w6KYmXPNuww"
---

# Adding JWTs to a Fastify Server

> This blog post accompanies the YouTube video: [Watch on YouTube](https://www.youtube.com/watch?v=w6KYmXPNuww)

This tutorial walks through the practical steps of implementing JWT authentication in a Fastify server. This was recorded as a live coding session, showing real-world implementation challenges and solutions.

## Overview

In this hands-on tutorial, we'll implement JWT authentication in a Fastify application from scratch, covering:

- Setting up the Fastify JWT plugin
- Creating login endpoints
- Protecting routes with JWT middleware
- Handling token validation and errors

## Project Setup

Let's start by setting up our Fastify server with JWT support:

```bash
npm init -y
npm install fastify @fastify/jwt bcryptjs dotenv
npm install -D nodemon
```

### Basic Server Setup

```javascript
// server.js
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

// Register JWT plugin
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

## User Authentication Setup

### Mock User Database

For this example, we'll use a simple in-memory user store:

```javascript
import bcrypt from 'bcryptjs';

// Mock user database
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: await bcrypt.hash('password123', 10)
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    passwordHash: await bcrypt.hash('userpass', 10)
  }
];

// Helper function to find user
const findUser = (username) => {
  return users.find(user => user.username === username);
};

// Helper function to validate password
const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
```

## Implementing Authentication Routes

### Login Route

```javascript
// Login endpoint
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  
  // Validate input
  if (!username || !password) {
    return reply.code(400).send({
      error: 'Username and password are required'
    });
  }
  
  // Find user
  const user = findUser(username);
  if (!user) {
    return reply.code(401).send({
      error: 'Invalid credentials'
    });
  }
  
  // Validate password
  const isValidPassword = await validatePassword(password, user.passwordHash);
  if (!isValidPassword) {
    return reply.code(401).send({
      error: 'Invalid credentials'
    });
  }
  
  // Generate JWT token
  const token = fastify.jwt.sign({
    userId: user.id,
    username: user.username,
    email: user.email
  }, {
    expiresIn: '1h' // Token expires in 1 hour
  });
  
  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
});
```

### Registration Route (Optional)

```javascript
fastify.post('/register', async (request, reply) => {
  const { username, email, password } = request.body;
  
  // Check if user already exists
  const existingUser = findUser(username);
  if (existingUser) {
    return reply.code(409).send({
      error: 'Username already exists'
    });
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email,
    passwordHash
  };
  
  users.push(newUser);
  
  // Generate token for new user
  const token = fastify.jwt.sign({
    userId: newUser.id,
    username: newUser.username,
    email: newUser.email
  }, {
    expiresIn: '1h'
  });
  
  return {
    message: 'Registration successful',
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  };
});
```

## Protecting Routes with JWT

### JWT Verification Hook

```javascript
// JWT verification function
const verifyJWT = async (request, reply) => {
  try {
    // This will verify the JWT and populate request.user
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      error: 'Authentication required',
      message: 'Please provide a valid token'
    });
  }
};
```

### Protected Routes

```javascript
// Protected route example
fastify.get('/profile', {
  preHandler: [verifyJWT]
}, async (request, reply) => {
  // request.user is available here after successful JWT verification
  const user = findUser(request.user.username);
  
  if (!user) {
    return reply.code(404).send({
      error: 'User not found'
    });
  }
  
  return {
    message: 'Profile data',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
});

// Another protected route
fastify.get('/dashboard', {
  preHandler: [verifyJWT]
}, async (request, reply) => {
  return {
    message: `Welcome to your dashboard, ${request.user.username}!`,
    data: {
      userId: request.user.userId,
      lastLogin: new Date().toISOString()
    }
  };
});
```

## Advanced JWT Handling

### Token Refresh

```javascript
fastify.post('/refresh', {
  preHandler: [verifyJWT]
}, async (request, reply) => {
  // Generate new token with extended expiration
  const newToken = fastify.jwt.sign({
    userId: request.user.userId,
    username: request.user.username,
    email: request.user.email
  }, {
    expiresIn: '1h'
  });
  
  return {
    message: 'Token refreshed',
    token: newToken
  };
});
```

### Logout Route

```javascript
// Note: With JWTs, logout is typically handled client-side
// by removing the token. For server-side logout, you'd need
// to maintain a blacklist of invalidated tokens
fastify.post('/logout', {
  preHandler: [verifyJWT]
}, async (request, reply) => {
  // In a real application, you might:
  // 1. Add token to a blacklist
  // 2. Store invalidated tokens in Redis
  // 3. Use shorter expiration times
  
  return {
    message: 'Logout successful'
  };
});
```

## Error Handling

### Global Error Handler

```javascript
// Global error handler for authentication errors
fastify.setErrorHandler((error, request, reply) => {
  // JWT related errors
  if (error.statusCode === 401) {
    reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
    return;
  }
  
  // Other errors
  fastify.log.error(error);
  reply.code(500).send({
    error: 'Internal Server Error'
  });
});
```

## Testing the Implementation

### Using curl

```bash
# Login to get token
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'

# Use token to access protected route
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Frontend Integration

```javascript
// Frontend example
const login = async (username, password) => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store token (consider using httpOnly cookies in production)
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.error);
  }
};

// Making authenticated requests
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Security Best Practices

1. **Use HTTPS in production** - Never send JWTs over unencrypted connections
2. **Strong secrets** - Use cryptographically secure random secrets
3. **Short expiration times** - Implement refresh token mechanism
4. **Validate all inputs** - Never trust client data
5. **Rate limiting** - Implement rate limiting on auth endpoints
6. **Proper error handling** - Don't leak sensitive information in errors

## Additional Resources

- [Watch the video on YouTube](https://www.youtube.com/watch?v=w6KYmXPNuww)
- [Fastify JWT Plugin](https://github.com/fastify/fastify-jwt)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Fastify Authentication Guide](https://www.fastify.io/docs/latest/Reference/Authentication/)

## Next Steps

- Implement refresh token mechanism
- Add role-based authorization
- Set up token blacklisting for logout
- Integrate with a real database
- Add rate limiting and security middleware

---

*This post is part of my YouTube tutorial series. Subscribe to [my channel](https://www.youtube.com/channel/UCtzNXx0YjJFvAuAPL9ZjQOw) for more tutorials!*