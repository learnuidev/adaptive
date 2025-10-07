import { useState } from "react";
import { useLoginMutation } from "@/modules/auth/use-login-mutation";
import { ForgotPasswordForm } from "./forgot-password-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAdaptive } from "@/lib/adaptive/adaptive-core-provider";
import { LoginError } from "@/modules/auth/auth.types";

export const LoginForm = ({
  isLogin,
  setIsLogin,
}: {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();
  const loginMutation = useLoginMutation();

  const adaptive = useAdaptive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      await loginMutation.mutateAsync({ email, password });

      adaptive.adaptive("user-login-success", {
        email,
      });

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      const loginErr = error as LoginError;
      setLoginError(loginErr.message);

      adaptive.adaptive("user-login-error", {
        email,
      });

      // Show toast for additional feedback
      toast({
        title: "Sign in failed",
        description: loginErr.message,
        variant: "destructive",
      });
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <CardTitle className="text-2xl font-semibold">
              adaptive.fyi
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Sign in to your analytics dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Display */}
            {loginError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLoginError(null); // Clear error when user starts typing
                }}
                required
                disabled={loginMutation.isPending}
                className={loginError ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(null); // Clear error when user starts typing
                  }}
                  required
                  disabled={loginMutation.isPending}
                  className={loginError ? "border-destructive pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
              onClick={() => setShowForgotPassword(true)}
              disabled={loginMutation.isPending}
            >
              Forgot your password?
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
