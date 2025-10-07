import { useState } from "react";
import { useForgotPasswordMutation } from "@/modules/auth/use-forgot-password-mutation";
import { useResetPasswordMutation } from "@/modules/auth/use-reset-password-mutation";
import { LoginError } from "@/modules/auth/auth.types";
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
import { Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Request code, 2: Reset password
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setStep(2);
      toast({
        title: "Reset code sent!",
        description: "Check your email for a password reset code.",
      });
    } catch (error) {
      const loginErr = error as LoginError;
      setError(loginErr.message);
      toast({
        title: "Failed to send reset code",
        description: loginErr.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        confirmationCode,
        newPassword,
      });
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      onBack(); // Go back to login form
    } catch (error) {
      const loginErr = error as LoginError;
      setError(loginErr.message);
      toast({
        title: "Password reset failed",
        description: loginErr.message,
        variant: "destructive",
      });
    }
  };

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
            {step === 1 
              ? "Enter your email to receive a password reset code"
              : "Enter the code from your email and your new password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={forgotPasswordMutation.isPending}
                  className={error ? "border-destructive" : ""}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Reset Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationCode">Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  type="text"
                  placeholder="Enter code from email"
                  value={confirmationCode}
                  onChange={(e) => {
                    setConfirmationCode(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={resetPasswordMutation.isPending}
                  className={error ? "border-destructive" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    disabled={resetPasswordMutation.isPending}
                    className={error ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={resetPasswordMutation.isPending}
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
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
                disabled={resetPasswordMutation.isPending}
              >
                Resend Code
              </Button>
            </form>
          )}

          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={onBack}
            disabled={forgotPasswordMutation.isPending || resetPasswordMutation.isPending}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
