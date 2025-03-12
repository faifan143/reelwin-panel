// File: app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import AdminPage from "@/components/AdminPage";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("reelWinToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("reelWinToken", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("reelWinToken");
    setIsLoggedIn(false);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <AdminPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </main>
  );
}
