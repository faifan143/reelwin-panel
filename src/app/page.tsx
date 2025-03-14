// File: app/page.tsx
"use client";

import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import AdminPage from "@/components/AdminPage";
import ManageInterests from "@/components/ManageInterests";

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

  return (
    <main className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <>
          <AdminPage />
          <ManageInterests />
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </main>
  );
}
