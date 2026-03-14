"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authstore";

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'buyer' | 'seller' 
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effectively waits for Zustand to finish loading from localStorage
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.replace("/signin");
      } else if (requiredRole && user?.role !== requiredRole) {
        // If a seller tries to access buyer pages or vice versa
        router.replace(user?.role === 'seller' ? "/seller/dashboard" : "/");
      }
    }
  }, [isHydrated, isAuthenticated, user, router, requiredRole]);

  // Show a clean loader while the app "remembers" the user
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}