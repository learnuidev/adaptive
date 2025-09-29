import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { adaptiveAppConfig } from "./adaptive-app-config";
import { AdaptiveProvider as _AdaptiveProvider } from "./adaptive-core-provider";
import { AdapiveIdentityProvider } from "./adaptive-identity-provider";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";

export const AdapiveProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();

  const { data: credentials } = useListUserCredentialsQuery();

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
