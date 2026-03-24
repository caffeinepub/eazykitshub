import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { Navigate } from "@tanstack/react-router";
import { AlertTriangle, Shield } from "lucide-react";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Still loading identity
  if (isInitializing || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center animate-pulse">
            <Shield className="h-6 w-6 text-muted-foreground" />
          </div>
          <Skeleton className="h-4 w-40" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!identity) {
    return <Navigate to="/admin/login" />;
  }

  // Logged in but not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            You don't have admin privileges. Contact your administrator for
            access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
