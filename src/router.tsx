import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated } from "./components/authenticated";
import { AdapiveProvider } from "./lib/adaptive/adaptive-provider";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Performance from "./pages/Performance";
import FeatureFlags from "./pages/FeatureFlags";
import Events from "./pages/Events";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import CredentialsList from "./pages/CredentialsList";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Authenticated>
        <AdapiveProvider>
          <ThemeProvider>
            <TooltipProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full bg-background">
                  <AppSidebar />
                  <main className="flex-1 flex flex-col">
                    <header className="flex h-12 items-center border-b bg-background px-4">
                      <SidebarTrigger />
                    </header>
                    <div className="flex-1 overflow-auto p-4">
                      <Outlet />
                    </div>
                    <Toaster />
                  </main>
                </div>
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </AdapiveProvider>
      </Authenticated>
    </QueryClientProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CredentialsList,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/$credentialId",
  component: Dashboard,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics/$credentialId",
  component: Analytics,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$credentialId",
  component: Users,
});

const performanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/performance/$credentialId",
  component: Performance,
});

const featureFlagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feature-flags/$credentialId",
  component: FeatureFlags,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$credentialId",
  component: Events,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goals/$credentialId",
  component: Goals,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights/$credentialId",
  component: Insights,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/$credentialId",
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  analyticsRoute,
  usersRoute,
  performanceRoute,
  featureFlagsRoute,
  eventsRoute,
  goalsRoute,
  insightsRoute,
  settingsRoute,
]);

// @ts-ignore - Temporary fix for router type issues
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
