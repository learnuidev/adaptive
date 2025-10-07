import { useTheme } from "@/contexts/ThemeContext";
import { useSignOutMutation } from "@/modules/auth/use-signout-mutation";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

interface TopNavbarProps {
  className?: string;
}

export const LogoutButton: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const { theme } = useTheme();
  const signOutMutation = useSignOutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      disabled={signOutMutation.isPending}
      className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${
                  signOutMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                      ? "bg-red-900/30 hover:bg-red-800/50 text-red-400"
                      : theme === "beige"
                        ? "bg-red-200/50 hover:bg-red-300/50 text-red-800"
                        : "bg-red-100/50 hover:bg-red-200/50 text-red-700"
                }
              `}
      whileHover={!signOutMutation.isPending ? { scale: 1.05 } : {}}
      whileTap={!signOutMutation.isPending ? { scale: 0.95 } : {}}
    >
      <LogOut className="w-4 h-4" />
    </motion.button>
  );
};
