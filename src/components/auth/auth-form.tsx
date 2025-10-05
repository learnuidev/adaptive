import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { Button } from "@/components/ui/button";

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  return (
    <div>
      <RegisterForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </div>
  );
};
