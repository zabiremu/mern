# 🚀 Quick Start Guide - MERN Comment System

Get up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed: `node --version`
- ✅ MongoDB running locally OR MongoDB Atlas account
- ✅ npm or yarn installed: `npm --version`

---

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd mern-comment-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd frontend
npm install
```

---

## Step 2: Configure Environment (1 minute)

### Backend Configuration

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-comment-system
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-comment-system
```

### Frontend Configuration

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 3: Start the Application (1 minute)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

---

## Step 4: Test the Application (1 minute)

### 1. Register a User
- Click "Register" in the navbar
- Fill in: username, email, password
- Click "Register"

### 2. Create a Comment
- You'll be redirected to the home page
- Type a comment in the text area
- Click "Post Comment"

### 3. Test Interactions
- ✅ Like your comment
- ✅ Edit your comment (click edit icon)
- ✅ Sort comments (try "Most Liked")
- ✅ Open a new incognito window and see real-time updates!

---

## 🎉 You're Done!

Your MERN Comment System is now running!

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
2. Or use MongoDB Atlas (cloud database)

---

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update frontend `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

---

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `CLIENT_URL` in `backend/.env` matches your frontend URL
2. Restart the backend server

---

### Issue: JWT Token Invalid

**Error:** `Invalid token. Please log in again.`

**Solution:**
1. Clear browser localStorage
2. Log in again

---

## Next Steps

### 🎨 Customize the UI
- Edit SCSS files in `frontend/src/styles/`
- Change colors in `frontend/src/styles/index.scss`

### 🔐 Add More Security
- Change `JWT_SECRET` to a strong random string
- Enable MongoDB authentication
- Add rate limiting rules

### 🚀 Deploy to Production
- See `README.md` for deployment instructions
- Deploy backend to Heroku/Railway/Render
- Deploy frontend to Netlify/Vercel

### 📚 Learn More
- Read `README.md` for full documentation
- Check `API_DOCUMENTATION.md` for API details
- Explore the code architecture

---

## API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register
Body: { username, email, password }

# Login
POST /api/auth/login
Body: { email, password }
```

### Comments
```bash
# Get comments
GET /api/comments?page=1&limit=10&sortBy=createdAt&order=desc

# Create comment
POST /api/comments
Headers: Authorization: Bearer <token>
Body: { text }

# Like comment
POST /api/comments/:id/like
Headers: Authorization: Bearer <token>
```

---

## Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'

# Get comments
curl http://localhost:5000/api/comments
```

---

## Project Structure Overview

```
mern-comment-system/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── config/      # Configuration
│   │   └── middlewares/ # Auth, validation
│   └── server.js        # Entry point
│
└── frontend/            # React application
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store
    │   └── services/    # API services
    └── public/
```

---

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: Uses `nodemon` (auto-restart on changes)
- Frontend: Uses `react-scripts` (auto-refresh on changes)

### Debugging
- Backend: Check terminal for errors
- Frontend: Open browser DevTools (F12)
- Redux: Install Redux DevTools extension

### Database
View your data:
```bash
# MongoDB Shell
mongosh
use mern-comment-system
db.users.find()
db.comments.find()
```

Or use MongoDB Compass (GUI)

---

## Need Help?

1. **Check the logs** - Look at terminal output
2. **Read the docs** - See `README.md` and `API_DOCUMENTATION.md`
3. **Check environment** - Verify `.env` files are correct
4. **Clear cache** - Try clearing browser cache/localStorage
5. **Restart servers** - Stop and restart both servers

---

## 🎯 What You've Built

✅ Full-stack MERN application
✅ JWT authentication system
✅ Real-time WebSocket updates
✅ RESTful API with pagination
✅ Redux state management
✅ Responsive React UI
✅ MongoDB database integration
✅ Production-ready architecture

---

**Happy Coding! 🚀**

If you found this helpful, please ⭐ star the repository!

