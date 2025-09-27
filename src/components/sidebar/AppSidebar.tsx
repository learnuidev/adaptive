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
import { Link, useLocation } from "@tanstack/react-router";
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

const getMainItems = (credentialId?: string) => [
  {
    title: "Credentials",
    url: "/",
    icon: Home,
    requiresCredential: false,
  },
  {
    title: "Dashboard",
    url: credentialId ? `/dashboard/${credentialId}` : null,
    icon: BarChart3,
    requiresCredential: true,
  },
  {
    title: "Analytics",
    url: credentialId ? `/analytics/${credentialId}` : null,
    icon: BarChart3,
    requiresCredential: true,
  },
  {
    title: "Users",
    url: credentialId ? `/users/${credentialId}` : null,
    icon: Users,
    requiresCredential: true,
  },
  {
    title: "Performance",
    url: credentialId ? `/performance/${credentialId}` : null,
    icon: TrendingUp,
    requiresCredential: true,
  },
  {
    title: "Feature Flags",
    url: credentialId ? `/feature-flags/${credentialId}` : null,
    icon: Flag,
    requiresCredential: true,
  },
];

const getToolsItems = (credentialId?: string) => [
  {
    title: "Events",
    url: credentialId ? `/events/${credentialId}` : null,
    icon: Activity,
    requiresCredential: true,
  },
  {
    title: "Goals",
    url: credentialId ? `/goals/${credentialId}` : null,
    icon: Target,
    requiresCredential: true,
  },
  {
    title: "Insights",
    url: credentialId ? `/insights/${credentialId}` : null,
    icon: Zap,
    requiresCredential: true,
  },
  {
    title: "Settings",
    url: credentialId ? `/settings/${credentialId}` : null,
    icon: Settings,
    requiresCredential: true,
  },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const signOutMutation = useSignOutMutation();
  const { toast } = useToast();

  // Get credentialId from current route params (handle case where it might not exist)
  const getCredentialId = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length >= 3) {
      return pathParts[2]; // e.g., /dashboard/credentialId -> credentialId
    }
    return undefined;
  };

  const credentialId = getCredentialId();
  const mainItems = getMainItems(credentialId);
  const toolsItems = getToolsItems(credentialId);

  // Precise active state detection
  const isActive = (url: string | null) => {
    if (!url) return false;

    // Exact match for root route
    if (url === "/" && location.pathname === "/") {
      return true;
    }

    // For other routes, check if current path matches exactly
    if (url !== "/" && location.pathname === url) {
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
          <Link
            to={item.url}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive(item.url)
                ? "bg-accent text-primary-foreground hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-primary-foreground"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
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
              <h1 className="text-lg font-bold text-foreground">Analytics</h1>
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
