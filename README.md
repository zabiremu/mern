# 💬 MERN Comment System

A production-ready, full-stack comment system built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, real-time updates, and a modern UI.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-v18-blue)

## 🌟 Features

### Core Functionality
- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Comment CRUD** - Create, read, update, delete comments
- ✅ **Like/Dislike System** - Users can like or dislike (only once per comment)
- ✅ **Real-time Updates** - Live updates using Socket.IO
- ✅ **Pagination** - Server-side pagination for performance
- ✅ **Sorting** - Sort by newest, most liked, or most disliked
- ✅ **Nested Comments** - Support for comment replies (optional)
- ✅ **Responsive Design** - Mobile-first, works on all devices

### Technical Features
- 🏗️ **Clean Architecture** - MVC + Service + Repository pattern
- 🔒 **Security** - Helmet, rate limiting, MongoDB sanitization
- 🎨 **Modern UI** - Beautiful, responsive design with SCSS
- 📦 **Redux Toolkit** - Predictable state management
- 🔄 **Real-time** - WebSocket integration
- ✨ **Production Ready** - Error handling, validation, best practices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mern-comment-system
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
mern-comment-system/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database, Socket.IO config
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── users/         # User management
│   │   │   └── comments/      # Comment system
│   │   ├── middlewares/       # Auth, validation, etc.
│   │   ├── routes/            # API routes
│   │   └── utils/             # Utilities
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── auth/          # Auth components
│   │   │   ├── comments/      # Comment components
│   │   │   └── layout/        # Layout components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Redux store
│   │   └── styles/            # SCSS styles
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Comment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/comments` | Get all comments | No |
| GET | `/api/comments/:id` | Get single comment | No |
| POST | `/api/comments` | Create comment | Yes |
| PUT | `/api/comments/:id` | Update comment | Yes (Owner) |
| DELETE | `/api/comments/:id` | Delete comment | Yes (Owner) |
| POST | `/api/comments/:id/like` | Like/unlike comment | Yes |
| POST | `/api/comments/:id/dislike` | Dislike/remove dislike | Yes |
| GET | `/api/comments/:id/replies` | Get comment replies | No |

### Query Parameters for GET /api/comments

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field: `createdAt`, `likes`, `dislikes` (default: createdAt)
- `order` - Sort order: `asc`, `desc` (default: desc)

## 🏗️ Architecture

### Backend Architecture

**Pattern:** MVC + Service + Repository

```
Controller (HTTP Layer)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Model (Database Schema)
```

**Benefits:**
- Separation of concerns
- Testability
- Maintainability
- Scalability

### Frontend Architecture

**State Management:** Redux Toolkit

**Why Redux Toolkit over Context API?**
- Better performance for complex state
- DevTools integration
- Middleware support (thunks)
- Normalized state structure
- Time-travel debugging

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt
- **Helmet** - Security HTTP headers
- **Rate Limiting** - 100 requests per 15 minutes
- **MongoDB Sanitization** - NoSQL injection prevention
- **Input Validation** - Server-side validation
- **CORS** - Configured for specific origins

## 🎨 Design Decisions

### Database Schema

**User Model:**
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, validated),
  password: String (hashed),
  timestamps: true
}
```

**Comment Model:**
```javascript
{
  text: String (1-1000 chars),
  author: ObjectId (ref: User),
  likes: [ObjectId] (array of user IDs),
  dislikes: [ObjectId] (array of user IDs),
  parentComment: ObjectId (nullable, for replies),
  timestamps: true
}
```

**Why arrays for likes/dislikes?**
- Prevents duplicate reactions
- Easy to check if user already reacted
- Simple count with array.length
- Atomic operations with MongoDB operators

### State Management Choice

**Redux Toolkit** was chosen because:
1. **Scalability** - Better for complex apps
2. **DevTools** - Excellent debugging experience
3. **Middleware** - Built-in async handling
4. **Performance** - Optimized re-renders
5. **Community** - Large ecosystem

**Context API** would work for smaller apps but lacks:
- Built-in async handling
- DevTools integration
- Middleware support
- Performance optimizations

## 🔄 Real-time Updates

Socket.IO events:

**Server → Client:**
- `comment:new` - New comment created
- `comment:update` - Comment updated/liked/disliked
- `comment:delete` - Comment deleted

**Client → Server:**
- `join:comments` - Join comments room
- `leave:comments` - Leave comments room

## 🧪 Business Rules

1. **Authentication:**
   - Users must register/login to interact
   - JWT token expires after 7 days
   - Auto-logout on token expiration

2. **Comments:**
   - Only authenticated users can create comments
   - Only comment owner can edit/delete
   - Comments have 1-1000 character limit

3. **Reactions:**
   - Users can like OR dislike (not both)
   - Only one reaction per user per comment
   - Clicking again removes the reaction
   - Liking removes dislike (and vice versa)

4. **Pagination:**
   - Server-side pagination (10 items per page)
   - Sorting by date, likes, or dislikes
   - Ascending or descending order

## 📦 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
CLIENT_URL=https://your-frontend.com
```

2. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

1. Build:
```bash
npm run build
```

2. Set environment variable:
```env
REACT_APP_API_URL=https://your-backend.com/api
```

3. Deploy the `build` folder

### MongoDB Atlas Setup

1. Create account at mongodb.com/atlas
2. Create cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in backend .env

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### API Testing
Use the provided Postman collection or:
```bash
curl http://localhost:5000/api/health
```

## 📚 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - WebSocket client
- **SCSS** - Styling
- **React Icons** - Icons
- **React Toastify** - Notifications

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profiles with avatars
- [ ] Comment edit history
- [ ] Mention system (@username)
- [ ] Rich text editor
- [ ] Image/GIF support
- [ ] Moderation tools
- [ ] Report system
- [ ] Search functionality
- [ ] Comment threading (nested replies)
- [ ] Notifications system

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ as a production-ready MERN stack application demonstrating:
- Clean architecture
- Security best practices
- Real-time features
- Modern UI/UX
- Scalable structure

## 🙏 Acknowledgments

- MERN Stack Community
- Redux Toolkit Documentation
- Socket.IO Documentation
- MongoDB University

---

**⭐ Star this repo if you find it helpful!**

For questions or issues, please open an issue on GitHub.

