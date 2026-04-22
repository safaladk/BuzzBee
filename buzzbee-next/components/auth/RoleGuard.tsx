"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "@/lib/toast-service";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Please login to access this page.");
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        toast.error("Permission Denied: Unauthorized role.");
        router.push("/login");
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
