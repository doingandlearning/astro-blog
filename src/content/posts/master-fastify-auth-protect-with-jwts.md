---
title: "Master Fastify Auth: Protect with JWTs"
description: "Learn various auth strategies including x-api-key and username/password, understand how JWTs differ, and implement JWT authentication to protect routes in Fastify."
date: "2024-08-20"
updateDate: ""
tags: ["fastify", "authentication", "jwt", "nodejs", "tutorial"]
draft: true
youtubeId: "FVJYlRvQom8"
---

# Master Fastify Auth: Protect with JWTs

> This blog post accompanies the YouTube video: [Watch on YouTube](https://www.youtube.com/watch?v=FVJYlRvQom8)

Authentication is a critical part of most web applications. In this tutorial, we'll explore different authentication strategies and dive deep into implementing JWT (JSON Web Token) authentication in Fastify applications.

## Overview

We'll cover multiple authentication approaches and then focus on JWTs as a stateless, scalable solution for protecting your Fastify routes.

## Authentication Strategies

### 1. API Key Authentication

Simple authentication using x-api-key headers:

```javascript
// Basic API key validation
const validateApiKey = async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: 'Invalid API key' });
  }
};
```

### 2. Username/Password Authentication

Traditional form-based authentication:

```javascript
// Basic username/password validation
const validateCredentials = async (username, password) => {
  // Compare with stored credentials
  const user = await User.findOne({ username });
  return await bcrypt.compare(password, user.passwordHash);
};
```

## Understanding JWTs

JSON Web Tokens (JWTs) offer several advantages:

- **Stateless**: No need to store session data on the server
- **Portable**: Can be used across different services
- **Self-contained**: Contains all necessary information
- **Secure**: Cryptographically signed

### JWT Structure

A JWT consists of three parts separated by dots:

```
header.payload.signature
```

## Implementing JWT Authentication in Fastify

### Step 1: Install Dependencies

```bash
npm install @fastify/jwt bcryptjs
```

### Step 2: Register JWT Plugin

```javascript
import fastifyJWT from '@fastify/jwt';

await fastify.register(fastifyJWT, {
  secret: process.env.JWT_SECRET
});
```

### Step 3: Login Route

```javascript
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  
  // Validate credentials
  const user = await validateUser(username, password);
  if (!user) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = fastify.jwt.sign({ 
    userId: user.id, 
    username: user.username 
  });
  
  return { token };
});
```

### Step 4: Protect Routes with JWT

```javascript
// JWT verification hook
const verifyJWT = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};

// Protected route
fastify.get('/protected', { preHandler: [verifyJWT] }, async (request) => {
  return { 
    message: 'This is protected!',
    user: request.user 
  };
});
```

## Best Practices

### 1. Secure Token Storage

- Store tokens securely on the client (httpOnly cookies for web)
- Use short expiration times
- Implement refresh token mechanism

### 2. Token Validation

```javascript
// Custom JWT validation with additional checks
const validateJWT = async (request, reply) => {
  try {
    await request.jwtVerify();
    
    // Additional validation
    const user = await User.findById(request.user.userId);
    if (!user || !user.isActive) {
      reply.code(401).send({ error: 'User not found or inactive' });
    }
  } catch (err) {
    reply.send(err);
  }
};
```

### 3. Error Handling

```javascript
// Centralized auth error handling
fastify.setErrorHandler((error, request, reply) => {
  if (error.statusCode === 401) {
    reply.code(401).send({ 
      error: 'Authentication required',
      message: 'Please provide a valid token'
    });
  }
});
```

## Security Considerations

- Use strong, random JWT secrets
- Implement proper token expiration
- Validate tokens on every request
- Consider using refresh tokens for long-lived sessions
- Implement rate limiting on auth endpoints

## Additional Resources

- [Watch the video on YouTube](https://www.youtube.com/watch?v=FVJYlRvQom8)
- [Fastify JWT Plugin Documentation](https://github.com/fastify/fastify-jwt)
- [JWT.io - JWT Debugger](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Next Steps

- Implement refresh token mechanism
- Add role-based authorization
- Explore OAuth2 integration
- Learn about JWT alternatives like sessions

---

*This post is part of my YouTube tutorial series. Subscribe to [my channel](https://www.youtube.com/channel/UCtzNXx0YjJFvAuAPL9ZjQOw) for more tutorials!*