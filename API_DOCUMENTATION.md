# 📡 MERN Comment System - Complete API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Auth Required:** No

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `username`: 3-30 characters, unique
- `email`: Valid email format, unique
- `password`: Minimum 6 characters

**Success Response (201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "status": "fail",
  "message": "Username already taken"
}

// 400 Bad Request - Invalid Input
{
  "status": "fail",
  "message": "Password must be at least 6 characters"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Login with existing credentials

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "status": "fail",
  "message": "Invalid email or password"
}

// 400 Bad Request
{
  "status": "fail",
  "message": "Please provide email and password"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Get currently authenticated user's information

**Auth Required:** Yes

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "status": "fail",
  "message": "You are not logged in. Please log in to access this resource."
}

// 401 Unauthorized - Invalid Token
{
  "status": "fail",
  "message": "Invalid token. Please log in again."
}
```

---

## 💬 Comment Endpoints

### 1. Get All Comments

**Endpoint:** `GET /api/comments`

**Description:** Get paginated list of comments with sorting options

**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| sortBy | string | createdAt | Sort field: `createdAt`, `likes`, `dislikes` |
| order | string | desc | Sort order: `asc`, `desc` |
| parentComment | string | null | Parent comment ID (for replies) |

**Example Request:**
```
GET /api/comments?page=1&limit=10&sortBy=likes&order=desc
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "text": "This is a great comment!",
        "author": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "johndoe",
          "email": "john@example.com"
        },
        "likes": ["507f1f77bcf86cd799439013"],
        "dislikes": [],
        "likeCount": 1,
        "dislikeCount": 0,
        "parentComment": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### 2. Get Single Comment

**Endpoint:** `GET /api/comments/:id`

**Description:** Get a specific comment by ID

**Auth Required:** No

**URL Parameters:**
- `id` - Comment ID

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439011",
      "text": "This is a great comment!",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "likes": ["507f1f77bcf86cd799439013"],
      "dislikes": [],
      "likeCount": 1,
      "dislikeCount": 0,
      "parentComment": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "status": "fail",
  "message": "Comment not found"
}

// 400 Bad Request - Invalid ID
{
  "status": "fail",
  "message": "Invalid ID format"
}
```

---

### 3. Create Comment

**Endpoint:** `POST /api/comments`

**Description:** Create a new comment

**Auth Required:** Yes

**Request Body:**
```json
{
  "text": "This is my new comment!",
  "parentComment": null
}
```

**Validation Rules:**
- `text`: Required, 1-1000 characters
- `parentComment`: Optional, valid comment ID

**Success Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439011",
      "text": "This is my new comment!",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "likes": [],
      "dislikes": [],
      "likeCount": 0,
      "dislikeCount": 0,
      "parentComment": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "status": "fail",
  "message": "You are not logged in. Please log in to access this resource."
}

// 400 Bad Request
{
  "status": "fail",
  "message": "Comment text is required"
}
```

---

### 4. Update Comment

**Endpoint:** `PUT /api/comments/:id`

**Description:** Update an existing comment (owner only)

**Auth Required:** Yes (Owner)

**URL Parameters:**
- `id` - Comment ID

**Request Body:**
```json
{
  "text": "Updated comment text"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439011",
      "text": "Updated comment text",
      "author": { ... },
      "likes": [],
      "dislikes": [],
      "likeCount": 0,
      "dislikeCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 403 Forbidden
{
  "status": "fail",
  "message": "You are not authorized to update this comment"
}

// 404 Not Found
{
  "status": "fail",
  "message": "Comment not found"
}
```

---

### 5. Delete Comment

**Endpoint:** `DELETE /api/comments/:id`

**Description:** Delete a comment (owner only)

**Auth Required:** Yes (Owner)

**URL Parameters:**
- `id` - Comment ID

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

**Error Responses:**
```json
// 403 Forbidden
{
  "status": "fail",
  "message": "You are not authorized to delete this comment"
}

// 404 Not Found
{
  "status": "fail",
  "message": "Comment not found"
}
```

---

### 6. Like Comment

**Endpoint:** `POST /api/comments/:id/like`

**Description:** Like or unlike a comment (toggle)

**Auth Required:** Yes

**URL Parameters:**
- `id` - Comment ID

**Behavior:**
- If user hasn't liked: Adds like, removes dislike if exists
- If user has liked: Removes like

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439011",
      "text": "This is a comment",
      "author": { ... },
      "likes": ["507f1f77bcf86cd799439013"],
      "dislikes": [],
      "likeCount": 1,
      "dislikeCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "status": "fail",
  "message": "You are not logged in. Please log in to access this resource."
}

// 404 Not Found
{
  "status": "fail",
  "message": "Comment not found"
}
```

---

### 7. Dislike Comment

**Endpoint:** `POST /api/comments/:id/dislike`

**Description:** Dislike or remove dislike from a comment (toggle)

**Auth Required:** Yes

**URL Parameters:**
- `id` - Comment ID

**Behavior:**
- If user hasn't disliked: Adds dislike, removes like if exists
- If user has disliked: Removes dislike

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439011",
      "text": "This is a comment",
      "author": { ... },
      "likes": [],
      "dislikes": ["507f1f77bcf86cd799439013"],
      "likeCount": 0,
      "dislikeCount": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 8. Get Comment Replies

**Endpoint:** `GET /api/comments/:id/replies`

**Description:** Get all replies to a specific comment

**Auth Required:** No

**URL Parameters:**
- `id` - Parent comment ID

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "replies": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "text": "This is a reply",
        "author": { ... },
        "likes": [],
        "dislikes": [],
        "parentComment": "507f1f77bcf86cd799439011",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 🔄 Real-time Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events to Emit
```javascript
// Join comments room
socket.emit('join:comments');

// Leave comments room
socket.emit('leave:comments');
```

### Events to Listen
```javascript
// New comment created
socket.on('comment:new', (comment) => {
  console.log('New comment:', comment);
});

// Comment updated (edited, liked, disliked)
socket.on('comment:update', (comment) => {
  console.log('Comment updated:', comment);
});

// Comment deleted
socket.on('comment:delete', (commentId) => {
  console.log('Comment deleted:', commentId);
});
```

---

## ⚠️ Error Handling

All error responses follow this format:

```json
{
  "status": "fail" | "error",
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (not authorized) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## 🔒 Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Response when exceeded:**
```json
{
  "status": "fail",
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 📝 Notes

1. **JWT Token Expiration:** Tokens expire after 7 days by default
2. **Pagination:** Maximum limit is 100 items per page
3. **Comment Length:** 1-1000 characters
4. **Username Length:** 3-30 characters
5. **Password Length:** Minimum 6 characters

---

## 🧪 Example Usage (cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Comments
```bash
curl http://localhost:5000/api/comments?page=1&limit=10&sortBy=likes&order=desc
```

### Create Comment
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"This is my comment!"}'
```

### Like Comment
```bash
curl -X POST http://localhost:5000/api/comments/COMMENT_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**For more information, see the main README.md**

