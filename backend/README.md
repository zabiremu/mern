# MERN Comment System - Backend

A production-ready RESTful API for a comment system built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **JWT Authentication** - Secure user authentication with JSON Web Tokens
- **Comment CRUD Operations** - Create, read, update, and delete comments
- **Like/Dislike System** - Users can like or dislike comments (only once per comment)
- **Pagination & Sorting** - Server-side pagination and multiple sorting options
- **Real-time Updates** - WebSocket support with Socket.IO
- **Security** - Helmet, rate limiting, MongoDB sanitization, XSS protection
- **Clean Architecture** - MVC + Service + Repository pattern
- **Error Handling** - Centralized error handling with custom error classes

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mern-comment-system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a strong, unique secret in production!

4. **Start the server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── socket.js            # Socket.IO configuration
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.routes.js
│   │   ├── users/
│   │   │   └── user.model.js
│   │   └── comments/
│   │       ├── comment.controller.js
│   │       ├── comment.service.js
│   │       ├── comment.repository.js
│   │       ├── comment.model.js
│   │       └── comment.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   └── validation.middleware.js
│   ├── routes/
│   │   └── index.js             # Main router
│   ├── utils/
│   │   ├── errorHandler.js      # Error handling utilities
│   │   └── jwt.js               # JWT utilities
│   └── app.js                   # Express app configuration
├── server.js                    # Server entry point
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": { ... }
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

### Comments

#### Get All Comments
```
GET /api/comments?page=1&limit=10&sortBy=createdAt&order=desc

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- sortBy: createdAt | likes | dislikes (default: createdAt)
- order: asc | desc (default: desc)

Response: 200 OK
{
  "status": "success",
  "data": {
    "comments": [...],
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

#### Get Single Comment
```
GET /api/comments/:id

Response: 200 OK
{
  "status": "success",
  "data": {
    "comment": { ... }
  }
}
```

#### Create Comment
```
POST /api/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "This is my comment",
  "parentComment": null  // optional, for nested replies
}

Response: 201 Created
{
  "status": "success",
  "data": {
    "comment": { ... }
  }
}
```

#### Update Comment
```
PUT /api/comments/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Updated comment text"
}

Response: 200 OK
{
  "status": "success",
  "data": {
    "comment": { ... }
  }
}
```

#### Delete Comment
```
DELETE /api/comments/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "status": "success",
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

#### Like Comment
```
POST /api/comments/:id/like
Authorization: Bearer {token}

Response: 200 OK
{
  "status": "success",
  "data": {
    "comment": { ... }
  }
}

Note: Clicking again will unlike the comment
```

#### Dislike Comment
```
POST /api/comments/:id/dislike
Authorization: Bearer {token}

Response: 200 OK
{
  "status": "success",
  "data": {
    "comment": { ... }
  }
}

Note: Clicking again will remove the dislike
```

#### Get Replies
```
GET /api/comments/:id/replies

Response: 200 OK
{
  "status": "success",
  "data": {
    "replies": [...]
  }
}
```

## 🔒 Security Features

- **Helmet** - Sets security HTTP headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **MongoDB Sanitization** - Prevents NoSQL injection attacks
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **CORS** - Configured for specific origin
- **Input Validation** - Server-side validation for all inputs

## 🔄 Real-time Features (Socket.IO)

The backend broadcasts real-time events for:

- **New comments** - `comment:new`
- **Updated comments** - `comment:update`
- **Deleted comments** - `comment:delete`

Clients can join the `comments` room to receive updates.

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required, 3-30 chars),
  email: String (unique, required, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  text: String (required, 1-1000 chars),
  author: ObjectId (ref: User, required),
  likes: [ObjectId] (ref: User),
  dislikes: [ObjectId] (ref: User),
  parentComment: ObjectId (ref: Comment, nullable),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/api/health
```

## 📦 Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_production_secret_key
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Business Rules

1. Users must be authenticated to:
   - Create comments
   - Edit/delete their own comments
   - Like/dislike comments

2. Like/Dislike rules:
   - A user can like OR dislike a comment only once
   - Liking a disliked comment removes the dislike (and vice versa)
   - Clicking like/dislike again removes the reaction

3. Comment ownership:
   - Only the comment author can edit or delete their comment

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ using the MERN stack

