import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // If already admin, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin === true) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isInitializing || adminLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-crimson" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-crimson/10 border border-crimson/20 mb-4">
            <Shield className="h-8 w-8 text-crimson" />
          </div>
          <h1 className="font-display text-4xl mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">
            Sign in with Internet Identity to access the admin dashboard
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          {isAuthenticated && isAdmin === false ? (
            <div className="text-center space-y-4">
              <p className="text-destructive text-sm">
                Your account doesn't have admin privileges.
              </p>
              <Button
                onClick={handleLogin}
                variant="outline"
                className="w-full rounded-sm"
              >
                Logout & Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Secure authentication via Internet Identity</p>
                <p>• No passwords required</p>
                <p>• Admin access verified on-chain</p>
              </div>

              <Button
                data-ocid="admin.login_button"
                size="lg"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full gradient-crimson text-white border-0 font-bold rounded-sm hover:opacity-90 shadow-glow py-6"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : isAuthenticated ? (
                  "Logout"
                ) : (
                  "Login with Internet Identity"
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
