import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Home,
  Users,
  Activity,
  Settings,
  Target,
  TrendingUp,
  Flag,
  Plus,
  Zap,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useWebsiteStore } from "@/stores/website-store";

interface DockItem {
  id: string;
  title: string;
  icon: any;
  url: string;
  requiresCredential: boolean;
  color: string;
}

interface DockProps {
  className?: string;
}

const Dock: React.FC<DockProps> = ({ className = "" }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedWebsiteId, setSelectedWebsite } = useWebsiteStore();
  const { data: websites } = useListUserWebsitesQuery();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const dockItems: DockItem[] = [
    {
      id: "webapps",
      title: "Web Apps",
      icon: Home,
      url: "/",
      requiresCredential: false,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
      url: "/dashboard",
      requiresCredential: true,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "people",
      title: "People",
      icon: Users,
      url: "/people",
      requiresCredential: true,
      color: "from-green-400 to-green-600",
    },
    {
      id: "goals",
      title: "Goals",
      icon: Target,
      url: "/goals",
      requiresCredential: true,
      color: "from-red-400 to-red-600",
    },
    {
      id: "trends",
      title: "Trends",
      icon: TrendingUp,
      url: "/trends",
      requiresCredential: true,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      id: "features",
      title: "Features",
      icon: Flag,
      url: "/features",
      requiresCredential: true,
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      url: "/settings",
      requiresCredential: true,
      color: "from-gray-400 to-gray-600",
    },
  ];

  const getWebsiteId = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3) {
      return pathParts[2];
    }
    return undefined;
  };

  const websiteId = getWebsiteId();

  const handleNavigation = (item: DockItem) => {
    if (!item.url) return;

    if (item.url === "/") {
      navigate({ to: "/" });
      return;
    }

    if (item.requiresCredential) {
      let targetCredentialId = websiteId || selectedWebsiteId;
      if (!targetCredentialId && websites && websites.length > 0) {
        targetCredentialId = websites[0].id;
        setSelectedWebsite(targetCredentialId);
      }
      if (targetCredentialId) {
        const fullUrl = `${item.url}/${targetCredentialId}`;
        navigate({ to: fullUrl as any });
      }
    } else {
      navigate({ to: item.url as any });
    }
  };

  const isActive = (url: string) => {
    if (url === "/" && location.pathname === "/") return true;
    if (url !== "/" && location.pathname.startsWith(url)) return true;
    return false;
  };

  return (
    <div className="w-full flex justify-center">
      <motion.div
        ref={dockRef}
        className={`
        fixed bottom-6 z-40 mx-auto
        ${className}
      `}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      >
        <div className="relative">
          {/* Dock Background */}
          <motion.div
            className={`
            px-6 py-3 rounded-2xl
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
              delay: 0.3,
            }}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {dockItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                const isHovered = hoveredItem === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className="relative"
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    whileHover={{ y: -8, scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className={`
                          px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap
                          ${
                            theme === "dark"
                              ? "bg-gray-800 text-gray-200"
                              : theme === "beige"
                                ? "bg-orange-800 text-orange-100"
                                : "bg-gray-800 text-white"
                          }
                        `}
                          >
                            {item.title}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div
                              className={`
                            w-0 h-0 border-l-4 border-r-4 border-t-4
                            border-l-transparent border-r-transparent
                            ${
                              theme === "dark"
                                ? "border-t-gray-800"
                                : theme === "beige"
                                  ? "border-t-orange-800"
                                  : "border-t-gray-800"
                            }
                          `}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dock Icon */}
                    <motion.button
                      onClick={() => handleNavigation(item)}
                      className={`
                      relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                      transition-all duration-200
                      ${
                        active
                          ? `bg-gradient-to-br ${item.color} shadow-lg`
                          : theme === "dark"
                            ? "bg-gray-800/50 hover:bg-gray-700/50"
                            : theme === "beige"
                              ? "bg-orange-200/50 hover:bg-orange-300/50"
                              : "bg-gray-200/50 hover:bg-gray-300/50"
                      }
                    `}
                    >
                      <Icon
                        className={`
                        w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200
                        ${
                          active
                            ? "text-white"
                            : theme === "dark"
                              ? "text-gray-300"
                              : theme === "beige"
                                ? "text-orange-800"
                                : "text-gray-700"
                        }
                      `}
                      />

                      {/* Active Indicator */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-1 h-1 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hover Glow */}
                      <AnimatePresence>
                        {isHovered && !active && (
                          <motion.div
                            className="absolute inset-0 rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              background: `linear-gradient(135deg, ${item.color.split(" ")?.[0]?.replace("from-", "")}20, ${item.color.split(" ")?.[2]?.replace("to-", "")}20)`,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Dock Magnifier Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              ${theme === "dark" ? "rgba(59, 130, 246, 0.1)" : theme === "beige" ? "rgba(251, 146, 60, 0.1)" : "rgba(59, 130, 246, 0.1)"} 0%, 
              transparent 50%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Dock;
