
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import DashboardInvestor from "./pages/DashboardInvestor";
import DashboardEntrepreneur from "./pages/DashboardEntrepreneur";
import InvestorProfile from "./pages/ProfileInvestor";
import EntrepreneurProfile from "./pages/ProfileEntrepreneur";
import Settings from "./pages/Settings";
import Entrance from "./pages/Entrance";
import TestVibrant from "./pages/TestVibrant";
import Chat from "./pages/Chat";

// Protected Route Component with Role-based Routing
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Role-based Dashboard Component
const RoleBasedDashboard = () => {
  const role = localStorage.getItem('role');
  
  if (role === 'investor') {
    return <Navigate to="/dashboard/investor" replace />;
  } else if (role === 'entrepreneur') {
    return <Navigate to="/dashboard/entrepreneur" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Entrance />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<TestVibrant />} />
            
            {/* Role-based Dashboard Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            } />
            
            {/* Role-specific Dashboard Routes */}
            <Route path="/dashboard/investor" element={
              <ProtectedRoute>
                <DashboardLayout title="Investor Dashboard" subtitle="Manage your investment portfolio">
                  <DashboardInvestor />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/entrepreneur" element={
              <ProtectedRoute>
                <DashboardLayout title="Entrepreneur Dashboard" subtitle="Manage your startup and connections">
                  <DashboardEntrepreneur />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Profile Routes */}
            <Route path="/profile/investor/:id" element={
              <ProtectedRoute>
                <DashboardLayout title="Investor Profile" subtitle="Manage your investor profile">
                  <InvestorProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/entrepreneur/:id" element={
              <ProtectedRoute>
                <DashboardLayout title="Entrepreneur Profile" subtitle="Manage your startup profile">
                  <EntrepreneurProfile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Chat Routes */}
            <Route path="/chat/:userId" element={
              <ProtectedRoute>
                <DashboardLayout title="Chat" subtitle="Connect with other users">
                  <Chat />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Settings Route */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout title="Settings" subtitle="Manage your account preferences">
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Messages Route */}
            <Route path="/messages" element={
              <ProtectedRoute>
                <DashboardLayout title="Messages" subtitle="Your conversations">
                  <Chat />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
