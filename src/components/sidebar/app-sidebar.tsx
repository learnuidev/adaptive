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
  Route,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
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

import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useWebsiteStore } from "@/stores/website-store";

const getMainItems = (websiteId?: string) => [
  {
    title: "Web Apps",
    url: "/",
    icon: Home,
    requiresCredential: false,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    requiresCredential: true,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    requiresCredential: true,
  },
  {
    title: "Events",
    url: "/events",
    icon: Activity,
    requiresCredential: true,
  },
];

const getToolsItems = (websiteId?: string) => [
  {
    title: "Cohorts",
    url: "/cohorts",
    icon: Users,
    requiresCredential: true,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
    requiresCredential: true,
  },

  {
    title: "Trends",
    url: "/trends",
    icon: TrendingUp,
    requiresCredential: true,
  },

  {
    title: "Features",
    url: "/features",
    icon: Flag,
    requiresCredential: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    requiresCredential: true,
  },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const signOutMutation = useSignOutMutation();
  const { toast } = useToast();
  const { selectedWebsiteId, setSelectedWebsite } = useWebsiteStore();
  const { data: websites } = useListUserWebsitesQuery();

  // Get websiteId from current route params (handle case where it might not exist)
  const getWebsiteId = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3) {
      return pathParts[2]; // e.g., /dashboard/websiteId -> websiteId
    }
    return undefined;
  };

  const websiteId = getWebsiteId();
  const mainItems = getMainItems(websiteId);
  const toolsItems = getToolsItems(websiteId);

  // Handle navigation with website selection logic
  const handleNavigation = (
    url: string | null,
    requiresCredential: boolean
  ) => {
    if (!url) return;

    // If it's the websites page, navigate directly
    if (url === "/") {
      navigate({ to: "/" });
      return;
    }

    // If it requires a website, we need to determine which website to use
    if (requiresCredential) {
      let targetCredentialId = websiteId || selectedWebsiteId;

      // If no website is available, use the first available website
      if (!targetCredentialId && websites && websites.length > 0) {
        targetCredentialId = websites[0].id;
        setSelectedWebsite(targetCredentialId);
      }

      if (targetCredentialId) {
        const fullUrl = `${url}/${targetCredentialId}`;
        navigate({ to: fullUrl as any });
      }
    } else {
      navigate({ to: url as any });
    }
  };

  // Precise active state detection
  const isActive = (url: string | null) => {
    if (!url) return false;

    // Exact match for root route
    if (url === "/" && location.pathname === "/") {
      return true;
    }

    // For other routes, check if current path starts with the base route
    if (url !== "/" && location.pathname.startsWith(url)) {
      return true;
    }

    return false;
  };

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderNavItem = (item: any) => {
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <button
            onClick={() => handleNavigation(item.url, item.requiresCredential)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left ${
              isActive(item.url)
                ? "bg-accent hover:text-primary-foreground text-primary-glow"
                : "text-muted-foreground hover:bg-accent hover:text-primary-foreground cursor-pointer"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      <SidebarContent className="flex flex-col h-full bg-background">
        {/* Logo */}
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <h1 className="text-lg font-bold text-foreground">
                adaptive.fyi
              </h1>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-2 pt-4">
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup className="px-2">
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wide mb-2">
              Tools
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings & Theme */}
        <div className="mt-auto p-2 space-y-2 border-t">
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
              <DropdownMenuContent
                align="end"
                className="bg-popover border-border"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("beige")}
                  className="cursor-pointer"
                >
                  Beige
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
            className={!collapsed ? "w-full justify-start" : ""}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && (
              <span className="ml-2">
                {signOutMutation.isPending ? "Signing out..." : "Sign Out"}
              </span>
            )}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
