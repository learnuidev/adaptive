import { useTheme } from "@/contexts/ThemeContext";
import { Palette } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: Sun,
      color: "from-yellow-200 to-yellow-300",
    },
    {
      id: "dark",
      name: "Dark",
      icon: Moon,
      color: "from-gray-700 to-gray-800",
    },
    {
      id: "beige",
      name: "Beige",
      icon: Coffee,
      color: "from-orange-200 to-orange-300",
    },
  ];

  const handleThemeChange = (newTheme: "light" | "dark" | "beige") => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsThemeMenuOpen(true)}
        className={`
          relative w-10 h-10 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${
            theme === "dark"
              ? "bg-gray-800/50 hover:bg-gray-700/50"
              : theme === "beige"
                ? "bg-orange-200/50 hover:bg-orange-300/50"
                : "bg-gray-200/50 hover:bg-gray-300/50"
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette
          className={`
            w-4 h-4 transition-colors duration-200
            ${
              theme === "dark"
                ? "text-gray-300"
                : theme === "beige"
                  ? "text-orange-800"
                  : "text-gray-700"
            }
          `}
        />
      </motion.button>

      {/* Theme Dropdown Menu */}
      <AnimatePresence>
        {isThemeMenuOpen && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`
                rounded-xl p-2 min-w-[120px]
                backdrop-blur-xl border shadow-lg
                ${
                  theme === "dark"
                    ? "bg-gray-900/90 border-gray-800/50"
                    : theme === "beige"
                      ? "bg-orange-50/90 border-orange-200/50"
                      : "bg-white/90 border-gray-200/50"
                }
              `}
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = themeOption.id === theme;

                return (
                  <motion.button
                    key={themeOption.id}
                    onClick={() =>
                      handleThemeChange(
                        themeOption.id as "light" | "dark" | "beige"
                      )
                    }
                    className={`
                      relative w-full px-3 py-2 rounded-lg flex items-center gap-2
                      transition-all duration-200
                      ${
                        isActive
                          ? `bg-gradient-to-r ${themeOption.color}`
                          : theme === "dark"
                            ? "hover:bg-gray-800/50"
                            : theme === "beige"
                              ? "hover:bg-orange-200/50"
                              : "hover:bg-gray-100/50"
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={`
                        w-4 h-4 transition-colors duration-200
                        ${
                          isActive
                            ? "text-gray-900"
                            : theme === "dark"
                              ? "text-gray-300"
                              : theme === "beige"
                                ? "text-orange-800"
                                : "text-gray-700"
                        }
                      `}
                    />
                    <span
                      className={`
                        text-xs font-medium
                        ${
                          isActive
                            ? "text-gray-900"
                            : theme === "dark"
                              ? "text-gray-300"
                              : theme === "beige"
                                ? "text-orange-800"
                                : "text-gray-700"
                        }
                      `}
                    >
                      {themeOption.name}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <Icon className="w-3 h-3 text-gray-900" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
