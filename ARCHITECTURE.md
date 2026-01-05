# 🏗️ MERN Comment System - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Security Architecture](#security-architecture)
7. [Real-time Architecture](#real-time-architecture)
8. [Design Decisions](#design-decisions)

---

## System Overview

### High-Level Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │◄───────►│   Express   │◄───────►│   MongoDB   │
│   (React)   │  HTTP   │   Server    │  Mongoose│  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │    WebSocket          │
       └───────────────────────┘
              Socket.IO
```

### Technology Stack

**Backend:**
- Runtime: Node.js v14+
- Framework: Express.js v4
- Database: MongoDB with Mongoose ODM
- Authentication: JWT (jsonwebtoken)
- Real-time: Socket.IO v4
- Security: Helmet, express-rate-limit, express-mongo-sanitize

**Frontend:**
- Library: React v18
- State Management: Redux Toolkit
- Routing: React Router v6
- HTTP Client: Axios
- Real-time: Socket.IO Client
- Styling: SCSS (Sass)
- Notifications: React Toastify

---

## Backend Architecture

### Layered Architecture Pattern

```
┌────────────────────────────────────────┐
│         Controller Layer               │  ← HTTP Request/Response
│  (Request validation, Response format) │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│          Service Layer                 │  ← Business Logic
│  (Business rules, Authorization)       │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│        Repository Layer                │  ← Data Access
│  (Database queries, Data mapping)      │
└────────────────┬───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│          Model Layer                   │  ← Data Schema
│  (Mongoose schemas, Validation)        │
└────────────────────────────────────────┘
```

### Module Structure

Each feature follows a consistent structure:

```
modules/
├── auth/
│   ├── auth.controller.js    # HTTP handlers
│   ├── auth.service.js       # Business logic
│   └── auth.routes.js        # Route definitions
├── users/
│   └── user.model.js         # User schema
└── comments/
    ├── comment.controller.js
    ├── comment.service.js
    ├── comment.repository.js # Data access
    ├── comment.model.js
    └── comment.routes.js
```

### Request Flow

```
1. HTTP Request
   ↓
2. Middleware (CORS, Security, Rate Limit)
   ↓
3. Route Handler
   ↓
4. Authentication Middleware (if protected)
   ↓
5. Controller (validates request)
   ↓
6. Service (business logic)
   ↓
7. Repository (database operations)
   ↓
8. Model (MongoDB)
   ↓
9. Response back through layers
   ↓
10. HTTP Response
```

### Why This Architecture?

**Separation of Concerns:**
- Controllers handle HTTP
- Services handle business logic
- Repositories handle data access
- Models define data structure

**Benefits:**
- ✅ Easy to test (mock each layer)
- ✅ Easy to maintain (clear responsibilities)
- ✅ Easy to scale (add features without breaking existing code)
- ✅ Reusable code (services can be used by multiple controllers)

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── HomePage
│   │   ├── CommentForm
│   │   └── CommentList
│   │       ├── CommentCard (multiple)
│   │       └── Pagination
│   ├── LoginPage
│   └── RegisterPage
```

### State Management (Redux Toolkit)

```
Store
├── authSlice
│   ├── State: { user, token, isAuthenticated, loading }
│   └── Actions: register, login, logout, loadUser
└── commentSlice
    ├── State: { comments, pagination, sortBy, loading }
    └── Actions: fetchComments, createComment, updateComment,
                 deleteComment, likeComment, dislikeComment
```

### Data Flow

```
User Action (Click/Submit)
   ↓
Component dispatches Redux action
   ↓
Async Thunk (Redux Toolkit)
   ↓
API Service (Axios)
   ↓
Backend API
   ↓
Response
   ↓
Redux state updated
   ↓
Components re-render
   ↓
Socket.IO broadcasts (real-time)
   ↓
Other clients receive update
   ↓
Redux state updated (real-time reducer)
   ↓
UI updates automatically
```

### Why Redux Toolkit?

**Comparison with Context API:**

| Feature | Redux Toolkit | Context API |
|---------|--------------|-------------|
| Learning Curve | Moderate | Easy |
| Boilerplate | Low (with RTK) | Very Low |
| DevTools | Excellent | None |
| Performance | Optimized | Can cause re-renders |
| Middleware | Built-in | Manual |
| Async Handling | Built-in Thunk | Manual |
| Time Travel | Yes | No |
| Best For | Medium-Large Apps | Small Apps |

**Our Choice: Redux Toolkit**
- Better for complex state interactions
- Excellent debugging with DevTools
- Built-in async handling
- Better performance at scale
- Real-time updates easier to manage

---

## Database Design

### Schema Design Philosophy

**Embedded vs Referenced:**
- User data in comments: **Referenced** (can update user info once)
- Likes/Dislikes: **Embedded** (array of IDs for performance)

### User Schema

```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `username`: Unique index for fast lookups
- `email`: Unique index for authentication

### Comment Schema

```javascript
{
  _id: ObjectId,
  text: String (1-1000 chars),
  author: ObjectId → User (indexed),
  likes: [ObjectId] → User,
  dislikes: [ObjectId] → User,
  parentComment: ObjectId → Comment (nullable, indexed),
  createdAt: Date (indexed),
  updatedAt: Date
}
```

**Virtual Fields:**
- `likeCount`: Computed from likes.length
- `dislikeCount`: Computed from dislikes.length

**Indexes:**
- `author`: For finding user's comments
- `createdAt`: For sorting by date
- `parentComment`: For finding replies

### Why Arrays for Likes/Dislikes?

**Alternative 1: Separate Collection**
```javascript
// Reactions collection
{ userId, commentId, type: 'like'|'dislike' }
```
❌ Requires JOIN operations
❌ More complex queries
❌ Additional collection to manage

**Alternative 2: Counter Fields**
```javascript
{ likeCount: Number, dislikeCount: Number }
```
❌ Can't check if user already reacted
❌ Can't prevent duplicates
❌ Race conditions possible

**Our Choice: Arrays**
```javascript
{ likes: [userId1, userId2], dislikes: [userId3] }
```
✅ Atomic operations with $addToSet, $pull
✅ Easy to check if user reacted
✅ Prevents duplicates automatically
✅ Simple count with array.length
✅ No JOIN operations needed

---

## API Design

### RESTful Principles

```
Resource: Comments
GET    /api/comments       → List all (with pagination)
GET    /api/comments/:id   → Get one
POST   /api/comments       → Create
PUT    /api/comments/:id   → Update
DELETE /api/comments/:id   → Delete

Sub-resources:
POST   /api/comments/:id/like     → Like/Unlike
POST   /api/comments/:id/dislike  → Dislike/Remove
GET    /api/comments/:id/replies  → Get replies
```

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... },
  "pagination": { ... }  // if applicable
}
```

**Error Response:**
```json
{
  "status": "fail" | "error",
  "message": "Error description"
}
```

### Pagination Strategy

**Server-Side Pagination:**
- Reduces data transfer
- Better performance
- Consistent experience

**Implementation:**
```javascript
const skip = (page - 1) * limit;
const comments = await Comment.find()
  .skip(skip)
  .limit(limit);
```

---

## Security Architecture

### Authentication Flow

```
1. User registers/logs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage)
   ↓
5. Client sends token with each request
   ↓
6. Server verifies token
   ↓
7. Server grants/denies access
```

### JWT Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Security Layers

```
┌─────────────────────────────────────┐
│  1. Helmet (HTTP Headers)           │
├─────────────────────────────────────┤
│  2. CORS (Origin Control)           │
├─────────────────────────────────────┤
│  3. Rate Limiting (100/15min)       │
├─────────────────────────────────────┤
│  4. MongoDB Sanitization            │
├─────────────────────────────────────┤
│  5. JWT Authentication              │
├─────────────────────────────────────┤
│  6. Input Validation                │
├─────────────────────────────────────┤
│  7. Authorization Checks            │
└─────────────────────────────────────┘
```

### Password Security

```
User Password
   ↓
bcrypt.genSalt(10)
   ↓
bcrypt.hash(password, salt)
   ↓
Hashed Password (stored in DB)
```

**Why bcrypt?**
- Slow by design (prevents brute force)
- Automatic salt generation
- Industry standard
- Adjustable cost factor

---

## Real-time Architecture

### Socket.IO Flow

```
Backend                          Frontend
   │                                │
   │◄──────── Connect ──────────────│
   │                                │
   │──── Authentication ───────────►│
   │                                │
   │◄────── join:comments ──────────│
   │                                │
   │                                │
User creates comment               │
   │                                │
   │──── comment:new ──────────────►│
   │                                │
   │                                │ Redux updates
   │                                │ UI re-renders
```

### Event Types

**Client → Server:**
- `join:comments` - Join comments room
- `leave:comments` - Leave comments room

**Server → Client:**
- `comment:new` - New comment created
- `comment:update` - Comment edited/liked/disliked
- `comment:delete` - Comment deleted

### Room-Based Broadcasting

```javascript
// Server broadcasts to all clients in 'comments' room
io.to('comments').emit('comment:new', comment);

// All clients except sender
socket.broadcast.to('comments').emit('comment:update', comment);
```

---

## Design Decisions

### 1. Why MVC + Service + Repository?

**Decision:** Use layered architecture instead of simple MVC

**Reasoning:**
- Better separation of concerns
- Easier to test each layer
- Business logic separated from HTTP logic
- Data access logic separated from business logic
- More maintainable as app grows

### 2. Why Redux Toolkit over Context API?

**Decision:** Use Redux Toolkit for state management

**Reasoning:**
- Better DevTools support
- Built-in async handling
- Better performance with many components
- Easier to manage complex state
- Real-time updates easier to integrate
- Better for team collaboration

### 3. Why Arrays for Likes/Dislikes?

**Decision:** Store likes/dislikes as arrays of user IDs

**Reasoning:**
- Atomic operations with MongoDB
- No duplicate reactions
- Easy to check if user reacted
- Simple counting
- No JOIN operations needed
- Better performance

### 4. Why Server-Side Pagination?

**Decision:** Implement pagination on backend

**Reasoning:**
- Reduces data transfer
- Better performance
- Consistent with large datasets
- Lower memory usage on client
- Better for mobile devices

### 5. Why Socket.IO for Real-time?

**Decision:** Use Socket.IO instead of WebSocket API

**Reasoning:**
- Automatic reconnection
- Room/namespace support
- Fallback to polling if WebSocket unavailable
- Built-in authentication
- Better browser compatibility
- Easier to implement

### 6. Why JWT over Sessions?

**Decision:** Use JWT tokens instead of server sessions

**Reasoning:**
- Stateless (no session storage needed)
- Scalable (works with multiple servers)
- Mobile-friendly
- Can include user data in token
- No database lookup on each request
- Works well with microservices

### 7. Why SCSS over CSS-in-JS?

**Decision:** Use SCSS for styling

**Reasoning:**
- Familiar to most developers
- Better tooling support
- Easier to maintain large stylesheets
- Variables and mixins
- No runtime overhead
- Better for theming

---

## Performance Considerations

### Backend Optimizations

1. **Database Indexes**
   - Indexed fields: username, email, author, createdAt
   - Faster queries for common operations

2. **Pagination**
   - Limit data transfer
   - Faster response times

3. **Lean Queries**
   - Use `.lean()` when virtuals not needed
   - Faster JSON conversion

4. **Connection Pooling**
   - Mongoose handles automatically
   - Reuses database connections

### Frontend Optimizations

1. **Code Splitting**
   - React.lazy() for route-based splitting
   - Smaller initial bundle

2. **Memoization**
   - React.memo for expensive components
   - useMemo for expensive calculations

3. **Debouncing**
   - Debounce search inputs
   - Reduce API calls

4. **Virtual Scrolling**
   - For large comment lists (future enhancement)

---

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
     │
     ├─── Server 1 ───┐
     ├─── Server 2 ───┼─── MongoDB Cluster
     └─── Server 3 ───┘
```

**Considerations:**
- JWT tokens work across servers (stateless)
- Socket.IO needs Redis adapter for multiple servers
- MongoDB can be clustered/sharded

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add caching layer (Redis)

---

## Future Enhancements

### Planned Features

1. **Caching Layer**
   - Redis for frequently accessed data
   - Reduce database load

2. **CDN Integration**
   - Serve static assets faster
   - Global distribution

3. **Search Functionality**
   - Elasticsearch for full-text search
   - Better search performance

4. **Microservices**
   - Split into separate services
   - Independent scaling

5. **GraphQL API**
   - Alternative to REST
   - Client-defined queries

---

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable and performant
- ✅ Secure by design
- ✅ Real-time capabilities
- ✅ Production-ready

The modular design allows for easy feature additions and modifications without breaking existing functionality.

---

**For implementation details, see the code and README.md**

