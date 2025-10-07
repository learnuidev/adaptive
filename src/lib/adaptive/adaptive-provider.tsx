import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { adaptiveAppConfig } from "./adaptive-app-config";
import { AdaptiveProvider as _AdaptiveProvider } from "./adaptive-core-provider";
import { AdapiveIdentityProvider } from "./adaptive-identity-provider";

export const AdaptiveProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();

  if (isLoading) {
    return;
  }

  return (
    <_AdaptiveProvider
      domain={new URL(window.location.href)?.host || "*"}
      apiKey={adaptiveAppConfig.apiKey}
      apiUrl={adaptiveAppConfig.apiUrl}
      identity={{
        email: authUser?.email,
      }}
    >
      <AdapiveIdentityProvider>{children}</AdapiveIdentityProvider>
    </_AdaptiveProvider>
  );
};
