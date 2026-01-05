# MERN Comment System - Frontend

A modern, responsive React application for a real-time comment system with authentication, built with Redux Toolkit and Socket.IO.

## 🚀 Features

- **User Authentication** - Register, login, and JWT-based authentication
- **Comment Management** - View, create, edit, and delete comments
- **Like/Dislike System** - Interactive reactions with real-time updates
- **Sorting & Pagination** - Sort by newest, most liked, or most disliked
- **Real-time Updates** - Live comment updates using Socket.IO
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Modern UI** - Clean, beautiful interface with smooth animations
- **State Management** - Redux Toolkit for predictable state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update with your deployed backend URL:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

4. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── PrivateRoute.js
│   │   ├── comments/
│   │   │   ├── CommentCard.js
│   │   │   ├── CommentCard.scss
│   │   │   ├── CommentForm.js
│   │   │   ├── CommentForm.scss
│   │   │   ├── CommentList.js
│   │   │   ├── CommentList.scss
│   │   │   ├── Pagination.js
│   │   │   └── Pagination.scss
│   │   └── layout/
│   │       ├── Navbar.js
│   │       └── Navbar.scss
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── HomePage.scss
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── AuthPages.scss
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js      # Auth API calls
│   │   ├── commentService.js   # Comment API calls
│   │   └── socket.js           # Socket.IO client
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js    # Auth state
│   │   │   └── commentSlice.js # Comment state
│   │   └── store.js            # Redux store
│   ├── styles/
│   │   └── index.scss          # Global styles
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🎨 Component Overview

### Pages

- **HomePage** - Main page displaying comments and comment form
- **LoginPage** - User login form
- **RegisterPage** - User registration form

### Components

#### CommentCard
Displays a single comment with:
- Author information and avatar
- Comment text
- Like/dislike buttons with counts
- Edit/delete buttons (for comment owner)
- Inline editing functionality

#### CommentForm
Form for creating new comments with:
- Character counter (max 1000 characters)
- Validation
- Loading states

#### CommentList
Container for all comments with:
- Sort controls (newest, most liked, most disliked)
- Order controls (ascending, descending)
- Pagination
- Loading states

#### Pagination
Pagination component with:
- Page numbers
- Previous/Next buttons
- Smart ellipsis for many pages

#### Navbar
Navigation bar with:
- Logo/branding
- User info (when logged in)
- Login/Register buttons (when logged out)
- Logout functionality

## 🔄 State Management

### Redux Toolkit Architecture

**Why Redux Toolkit?**
- **Predictable State** - Centralized state management
- **DevTools Integration** - Time-travel debugging
- **Simplified Boilerplate** - Less code than traditional Redux
- **Built-in Best Practices** - Immer, Redux Thunk included
- **TypeScript Support** - Great for scaling

**Alternative:** React Context API could be used for smaller apps, but Redux Toolkit is better for:
- Complex state interactions
- Multiple components needing the same data
- Real-time updates across the app
- Better performance with large state trees

### Auth Slice
Manages authentication state:
- User data
- JWT token
- Loading states
- Login/register/logout actions

### Comment Slice
Manages comment state:
- Comments array
- Pagination data
- Sorting preferences
- CRUD operations
- Real-time updates

## 🔌 API Integration

### Axios Configuration
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Automatic token refresh on page reload

### Services

#### authService
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user data

#### commentService
- `getComments(params)` - Fetch comments with pagination/sorting
- `createComment(data)` - Create new comment
- `updateComment(id, data)` - Update comment
- `deleteComment(id)` - Delete comment
- `likeComment(id)` - Like/unlike comment
- `dislikeComment(id)` - Dislike/remove dislike
- `getReplies(id)` - Get comment replies

## 🔄 Real-time Updates

Socket.IO integration provides live updates:

```javascript
// Events received from server
socket.on('comment:new', (comment) => {
  // New comment added
});

socket.on('comment:update', (comment) => {
  // Comment updated (edited, liked, disliked)
});

socket.on('comment:delete', (commentId) => {
  // Comment deleted
});
```

## 🎨 Styling

### SCSS Architecture
- **Variables** - Colors, breakpoints, spacing
- **Mixins** - Reusable style patterns
- **Component Styles** - Scoped to each component
- **Responsive Design** - Mobile-first approach
- **BEM Methodology** - Consistent naming convention

### Design System
- **Primary Color:** #4f46e5 (Indigo)
- **Secondary Color:** #06b6d4 (Cyan)
- **Success:** #10b981 (Green)
- **Danger:** #ef4444 (Red)

### Breakpoints
- Mobile: 576px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

## 🔒 Protected Routes

The `PrivateRoute` component protects routes that require authentication:

```javascript
<Route
  path="/protected"
  element={
    <PrivateRoute>
      <ProtectedComponent />
    </PrivateRoute>
  }
/>
```

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** - Optimized touch targets, simplified layouts
- **Tablet** - Balanced layout with more spacing
- **Desktop** - Full-featured interface with all controls

## 🚀 Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## 📦 Deployment

### Netlify / Vercel

1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variable: `REACT_APP_API_URL`

### Environment Variables

Make sure to set:
```
REACT_APP_API_URL=https://your-backend-api.com/api
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 🎯 User Flow

1. **Landing Page** - View all comments (public)
2. **Register/Login** - Create account or login
3. **Add Comment** - Write and post comments
4. **Interact** - Like/dislike comments
5. **Manage** - Edit/delete your own comments
6. **Real-time** - See updates instantly

## ✨ Features Showcase

### Authentication
- JWT token stored in localStorage
- Auto-login on page refresh
- Auto-logout on token expiration
- Protected routes

### Comment Features
- Create, read, update, delete (CRUD)
- Like/dislike with toggle functionality
- Real-time updates via WebSocket
- Server-side pagination
- Multiple sorting options
- Character limit validation

### UX Enhancements
- Loading states
- Error handling with toast notifications
- Optimistic UI updates
- Smooth animations
- Responsive design
- Accessibility features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ using React, Redux Toolkit, and Socket.IO

