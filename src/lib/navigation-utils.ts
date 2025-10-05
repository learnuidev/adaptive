import { useNavigate } from "@tanstack/react-router";

export type NavigationPath =
  | "/dashboard"
  | "/dashboard/$websiteId"
  | "/websites"
  | "/cohorts"
  | "/cohorts/$websiteId"
  | "/cohorts/$websiteId/add"
  | "/features"
  | "/features/$websiteId"
  | "/users"
  | "/users/$websiteId"
  | "/settings";

export function useNavigationUtils() {
  const navigate = useNavigate();

  const navigateToDashboard = (websiteId?: string) => {
    if (websiteId) {
      navigate({ to: "/dashboard/$websiteId", params: { websiteId } });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const navigateToWebsites = () => {
    navigate({ to: "/websites" });
  };

  const navigateToCohorts = (websiteId?: string) => {
    if (websiteId) {
      navigate({ to: "/cohorts/$websiteId", params: { websiteId } });
    } else {
      navigate({ to: "/cohorts" });
    }
  };

  const navigateToAddCohort = (websiteId: string) => {
    navigate({ to: "/cohorts/$websiteId/add", params: { websiteId } });
  };

  const navigateToFeatures = (websiteId?: string) => {
    if (websiteId) {
      navigate({ to: "/features/$websiteId", params: { websiteId } });
    } else {
      navigate({ to: "/features" });
    }
  };

  const navigateToUsers = (websiteId?: string) => {
    if (websiteId) {
      navigate({ to: "/users/$websiteId", params: { websiteId } });
    } else {
      navigate({ to: "/users" });
    }
  };

  const navigateToSettings = () => {
    navigate({ to: "/settings" });
  };

  const goBack = () => {
    window.history.back();
  };

  return {
    navigateToDashboard,
    navigateToWebsites,
    navigateToCohorts,
    navigateToAddCohort,
    navigateToFeatures,
    navigateToUsers,
    navigateToSettings,
    goBack,
  };
}
