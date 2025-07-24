import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Weather from "@/pages/Weather";
import Events from "@/pages/Events";
import Workout from "@/pages/Workout";
import Photos from "@/pages/Photos";
import LoginModal from "@/components/LoginModal";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  // Check if user was previously authenticated (optional: persist login state)
  useEffect(() => {
    const savedAuthState = localStorage.getItem('isAuthenticated');
    if (savedAuthState === 'true') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    }
  }, []);

  // Save authentication state
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <>
      {/* Always render the dashboard components */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/events" element={<Events />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
      </Router>
      
      {/* Login modal overlay */}
      <LoginModal isOpen={showLoginModal && !isAuthenticated} onLogin={handleLogin} />
    </>
  );
}
