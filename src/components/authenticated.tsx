import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";
import { AuthForm } from "./auth/auth-form";
import LandingPage from "@/pages/landing";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useIsAuthenticatedQuery();
  const path = window.location.pathname;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg animate-pulse mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    // Show landing page on root route, otherwise show auth form
    if (path === "/") {
      return <LandingPage />;
    }
    return <AuthForm />;
  }

  return <>{children}</>;
};
