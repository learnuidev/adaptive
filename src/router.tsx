import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Authenticated } from "./components/authenticated";
import { AdapiveProvider } from "./lib/adaptive/adaptive-provider";

import Dashboard from "./pages/dashboard-page";
import Users from "./pages/users-page";
import UserDetail from "./pages/user-detail";
import Cohorts from "./pages/cohorts-page";
import AddCohort from "./pages/add-cohort";
import CohortDetail from "./pages/cohort-detail";
import Features from "./pages/features-page";
import FeatureDetail from "./pages/feature-detail";
import AddFeatureVersion from "./pages/add-feature-version";
import Events from "./pages/events-page";
import Goals from "./pages/goals-page";
import Trends from "./pages/trends-page";
import Insights from "./pages/insights-page";
import Settings from "./pages/settings-page";
import CredentialsList from "./pages/credentials-list";
import Documentation from "./pages/documentation-page";

const queryClient = new QueryClient();

// Main root route with conditional authentication
const rootRoute = createRootRoute({
  component: () => {
    const path = window.location.pathname;
    const isPublicRoute = path.startsWith("/doc");

    if (isPublicRoute) {
      return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      );
    }

    return (
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
    );
  },
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

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$credentialId",
  component: Users,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$credentialId/$userId",
  component: UserDetail,
});

const cohortsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cohorts/$credentialId",
  component: Cohorts,
});

const addCohortRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cohorts/$credentialId/add",
  component: AddCohort,
});

const cohortDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cohorts/$credentialId/$cohortId",
  component: CohortDetail,
});

const featureFlagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features/$credentialId",
  component: Features,
});

const featureDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features/$credentialId/$featureId",
  component: FeatureDetail,
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

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trends/$credentialId",
  component: Trends,
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

const addFeatureVersionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/features/$credentialId/$featureId/add-version",
  component: AddFeatureVersion,
});

// Public documentation route (no authentication required)
const documentationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doc",
  component: Documentation,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  usersRoute,
  userDetailRoute,
  cohortsRoute,
  addCohortRoute,
  cohortDetailRoute,
  featureFlagsRoute,
  featureDetailRoute,
  addFeatureVersionRoute,
  eventsRoute,
  goalsRoute,
  trendsRoute,
  insightsRoute,
  settingsRoute,
  documentationRoute,
]);

// @ts-ignore - Temporary fix for router type issues
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
