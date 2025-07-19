# Business Nexus - Full Stack Development Platform

A professional networking platform designed to connect entrepreneurs and investors, built with React.js and Node.js.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/register with JWT tokens
- **Role-based Access**: Separate dashboards for investors and entrepreneurs
- **Profile Management**: Comprehensive profiles with edit capabilities
- **Collaboration System**: Request and manage collaboration between users
- **Real-time Features**: Modern UI with responsive design

### Investor Features
- Browse entrepreneurs and their startups
- View detailed entrepreneur profiles
- Send collaboration requests
- Manage investment preferences
- Track portfolio companies

### Entrepreneur Features
- Create detailed startup profiles
- Manage funding requirements
- Receive and respond to investor requests
- Showcase pitch decks and business plans

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Axios** for API integration
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
business/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/business-nexus
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start the development servers**

   Backend (from `backend/` directory):
   ```bash
   npm start
   ```

   Frontend (from `frontend/` directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Profile Endpoints
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/profile` - Update own profile
- `GET /api/profile/entrepreneurs` - Get all entrepreneurs
- `GET /api/profile/investors` - Get all investors

### Collaboration Endpoints
- `POST /api/collaboration/request` - Send collaboration request
- `GET /api/collaboration/requests` - Get user's requests
- `PATCH /api/collaboration/request/:id` - Update request status

## 🎨 UI/UX Features

### Design System
- **Glassmorphism**: Modern glass-like effects
- **Gradients**: Beautiful color transitions
- **Animations**: Smooth hover and transition effects
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components

### Components
- **DashboardLayout**: Shared layout with sidebar navigation
- **Profile Pages**: Comprehensive profile views with edit capabilities
- **Toast Notifications**: User feedback system
- **Form Validation**: Real-time validation with error handling

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Authorization**: Protected routes based on user roles
- **Input Validation**: Server-side and client-side validation
- **CORS Protection**: Cross-origin request handling

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend Deployment (Render/Railway/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Profile management
- ✅ Collaboration requests
- ✅ Basic dashboards

### Phase 2 (Future)
- 🔄 Real-time chat system
- 🔄 Advanced search and filtering
- 🔄 File upload for pitch decks
- 🔄 Email notifications
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 🔄 Mobile app
- 🔄 Advanced matching algorithms
- 🔄 Payment integration
- 🔄 Video conferencing

---

**Built with ❤️ for connecting entrepreneurs and investors worldwide** 