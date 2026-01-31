import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useAuthStore } from "../store/AuthStore";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { status, bootstrap } = useAuthStore();

  useEffect(() => {
    if (status === "idle") {
      bootstrap();
    }
  }, [bootstrap, status]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
