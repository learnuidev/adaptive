import React, { useState } from "react";
import { LoginForm } from "./login-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/modules/auth/use-login-mutation";
import { useForm } from "react-hook-form";
import { RegisterForm } from "./register-form";

interface RegisterFormProps {
  onSubmit: (data: { email: string; password: string; name: string }) => void;
}

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const loginMutation = useLoginMutation();

  const handleLoginSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    try {
      await loginMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login",
        variant: "destructive",
      });
    }
  };

  const handleRegisterSubmit = (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    toast({
      title: "Registration",
      description: "Registration functionality coming soon",
    });
  };

  if (isLogin) {
    return <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  return (
    <div>
      <RegisterForm isLogin={isLogin} setIsLogin={setIsLogin} />

      <Button
        variant="ghost"
        className="w-full mt-4"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </Button>
    </div>
  );
};
