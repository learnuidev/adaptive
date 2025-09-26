// import { useCurrentAuthUser } from "@/domain/auth/auth.queries";

import { AdaptiveProvider as AdaptiveProviderApp } from "adaptive-engine/dist/index";

// import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";
import { adaptiveAppConfig } from "./adaptive-app-config";

export const AdativeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AdaptiveProviderApp
      domain={new URL(window.location.href)?.host || "*"}
      apiKey={adaptiveAppConfig.apiKey}
      apiUrl={adaptiveAppConfig.apiUrl}
      identity={{
        email: "todo",
      }}
    >
      {children}
    </AdaptiveProviderApp>
  );
};
