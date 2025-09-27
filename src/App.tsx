import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import FeatureFlags from "./pages/FeatureFlags";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Performance from "./pages/Performance";
import Events from "./pages/Events";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import CredentialsList from "./pages/CredentialsList";
import NotFound from "./pages/NotFound";
import { Authenticated } from "./components/authenticated";
import { AdapiveProvider } from "./lib/adaptive/adaptive-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Authenticated>
      <AdapiveProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full bg-background">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <header className="h-12 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm px-4">
                      <SidebarTrigger className="mr-2" />
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">
                          Live
                        </span>
                      </div>
                    </header>
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<CredentialsList />} />
                        <Route path="/dashboard/:credentialId" element={<Dashboard />} />
                        <Route path="/analytics/:credentialId" element={<Analytics />} />
                        <Route path="/users/:credentialId" element={<Users />} />
                        <Route path="/performance/:credentialId" element={<Performance />} />
                        <Route path="/feature-flags/:credentialId" element={<FeatureFlags />} />
                        <Route path="/events/:credentialId" element={<Events />} />
                        <Route path="/goals/:credentialId" element={<Goals />} />
                        <Route path="/insights/:credentialId" element={<Insights />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AdapiveProvider>
    </Authenticated>
  </QueryClientProvider>
);

export default App;
