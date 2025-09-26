import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";
import { LoginForm } from "@/components/auth/login-form";
import { AuthForm } from "./auth/auth-form";

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useIsAuthenticatedQuery();

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
    return <AuthForm />;
  }

  return <>{children}</>;
};
