import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Palette, Sun, Moon, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSignOutMutation } from "@/modules/auth/use-signout-mutation";
import { useNavigate } from "@tanstack/react-router";
import { ThemeSelector } from "../sidebar/theme-selector";
import { LogoutButton } from "./logout-button";

interface TopNavbarProps {
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  const signOutMutation = useSignOutMutation();
  const navigate = useNavigate();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
      color: "from-gray-100 to-gray-200",
    },
    {
      id: "beige",
      name: "Beige",
      icon: Sun,
      color: "from-orange-100 to-orange-200",
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
      color: "from-gray-800 to-gray-900",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleThemeChange = (newTheme: "light" | "beige" | "dark") => {
    setTheme(newTheme);
    // setIsThemeMenuOpen(false;
  };

  const currentTheme = themes.find((t) => t.id === theme);

  return (
    <div className="w-full flex justify-center">
      <motion.div
        className={`
        fixed top-4 transform z-40
        ${className}
      `}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative">
          {/* Navbar Background */}
          <motion.div
            className={`
            px-4 py-2 rounded-2xl
            backdrop-blur-xl
            ${
              theme === "dark"
                ? "bg-gray-900/80 border-gray-800/50"
                : theme === "beige"
                  ? "bg-orange-50/80 border-orange-200/50"
                  : "bg-white/80 border-gray-200/50"
            }
            border shadow-2xl
          `}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.1,
            }}
          >
            <div className="flex items-center gap-2">
              {/* Theme Switcher */}

              <ThemeSelector />

              {/* Separator */}
              <div
                className={`
                w-px h-6
                ${
                  theme === "dark"
                    ? "bg-gray-700"
                    : theme === "beige"
                      ? "bg-orange-300"
                      : "bg-gray-300"
                }
              `}
              />

              {/* Logout Button */}

              <LogoutButton />
            </div>
          </motion.div>
        </div>

        {/* Click outside to close theme menu */}
        {isThemeMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsThemeMenuOpen(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TopNavbar;
