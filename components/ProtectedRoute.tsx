"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center px-4">
        <div className="frame-panel-dark flex items-center gap-3 px-6 py-4 text-sm font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Checking your session
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
