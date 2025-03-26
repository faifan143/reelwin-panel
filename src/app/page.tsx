// File: app/page.tsx
"use client";

import useStore from "@/store";
import dynamic from "next/dynamic";

// Use dynamic import to prevent hydration errors with localStorage
const RootLayout = dynamic(() => import("./layout"), { ssr: false });

export default function Home() {
  // Use Zustand store instead of local state
  const { isAuthenticated } = useStore();

  // This is now handled by the store with persistence
  // so we don't need the local login/logout handling

  return (
    <main className="min-h-screen bg-gray-100">
      <RootLayout />
    </main>
  );
}
