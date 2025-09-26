// import { useCurrentAuthUser } from "@/domain/auth/auth.queries";

// import { useIsAuthenticatedQuery } from "@/modules/auth/use-is-authenticated.query";
import { adaptiveAppConfig } from "./adaptive-app-config";
import { AdaptiveProvider as _AdaptiveProvider } from "./adaptive-core-provider";

export const AdativeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <_AdaptiveProvider
      domain={new URL(window.location.href)?.host || "*"}
      apiKey={adaptiveAppConfig.apiKey}
      apiUrl={adaptiveAppConfig.apiUrl}
      identity={{
        email: "todo",
      }}
    >
      {children}
    </_AdaptiveProvider>
  );
};
