
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/investor" element={<DashboardInvestor />} />
        <Route path="/dashboard/entrepreneur" element={<DashboardEntrepreneur />} />
        <Route path="/profile/investor/:id" element={<InvestorProfile />} />
        <Route path="/profile/entrepreneur/:id" element={<EntrepreneurProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test" element={<TestVibrant />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
