import { useState } from "react";
import {
  BarChart3,
  Flag,
  Home,
  Users,
  TrendingUp,
  Settings,
  Zap,
  Activity,
  Target,
  Palette,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSignOutMutation } from "@/modules/auth/use-signout-mutation";
import { useToast } from "@/hooks/use-toast";

import { useParams } from "react-router-dom";

const getMainItems = (credentialId?: string) => [
  { title: "Credentials", url: "/", icon: Home },
  { title: "Dashboard", url: credentialId ? `/dashboard/${credentialId}` : "/", icon: BarChart3 },
  { title: "Analytics", url: credentialId ? `/analytics/${credentialId}` : "/", icon: BarChart3 },
  { title: "Users", url: credentialId ? `/users/${credentialId}` : "/", icon: Users },
  { title: "Performance", url: credentialId ? `/performance/${credentialId}` : "/", icon: TrendingUp },
  { title: "Feature Flags", url: credentialId ? `/feature-flags/${credentialId}` : "/", icon: Flag },
];

const getToolsItems = (credentialId?: string) => [
  { title: "Events", url: credentialId ? `/events/${credentialId}` : "/", icon: Activity },
  { title: "Goals", url: credentialId ? `/goals/${credentialId}` : "/", icon: Target },
  { title: "Insights", url: credentialId ? `/insights/${credentialId}` : "/", icon: Zap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { credentialId } = useParams();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const signOutMutation = useSignOutMutation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const mainItems = getMainItems(credentialId);
  const toolsItems = getToolsItems(credentialId);

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-soft"
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  return (
    <Sidebar
      className="border-r border-sidebar-border glass-strong"
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo */}
        <div
          className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 mb-8 px-2`}
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-emerald flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-lg text-sidebar-foreground truncate">
                adaptive.fyi
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Analytics Platform
              </p>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel
            className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${collapsed ? "text-center" : ""}`}
          >
            {!collapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={collapsed ? "flex justify-center" : ""}
                >
                  <SidebarMenuButton
                    asChild
                    className={collapsed ? "flex justify-center w-full" : ""}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className={`transition-all duration-200 flex items-center ${
                        collapsed
                          ? "px-0 justify-center w-full rounded-none"
                          : "rounded-lg"
                      } ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Navigation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel
            className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${collapsed ? "text-center" : ""}`}
          >
            {!collapsed && "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={collapsed ? "flex justify-center" : ""}
                >
                  <SidebarMenuButton
                    asChild
                    className={collapsed ? "flex justify-center w-full" : ""}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className={`transition-all duration-200 flex items-center ${
                        collapsed
                          ? "px-0 justify-center w-full rounded-none"
                          : "rounded-lg"
                      } ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Theme */}
        <div className="mt-auto space-y-2">
          {!collapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Theme
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-muted mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("beige")}>
                  <div className="w-3 h-3 rounded-full bg-amber-100 border-2 border-muted mr-2" />
                  Beige
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <div className="w-3 h-3 rounded-full bg-gray-900 border-2 border-muted mr-2" />
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <SidebarMenuItem className={collapsed ? "flex justify-center" : ""}>
            <SidebarMenuButton
              asChild
              className={collapsed ? "flex justify-center w-full" : ""}
            >
              <NavLink
                to="/settings"
                className={`transition-all duration-200 flex items-center ${
                  collapsed
                    ? "px-0 justify-center w-full rounded-none"
                    : "rounded-lg"
                } ${getNavCls({ isActive: isActive("/settings") })}`}
              >
                <Settings className="w-5 h-5" />
                {!collapsed && <span className="font-medium">Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className={collapsed ? "flex justify-center w-full" : ""}>
            <Button
              variant="ghost"
              size="sm"
              className={`${
                collapsed
                  ? "w-full px-0 justify-center rounded-none"
                  : "w-full justify-start rounded-lg"
              } text-muted-foreground hover:text-destructive hover:bg-destructive/10`}
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="font-medium ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
