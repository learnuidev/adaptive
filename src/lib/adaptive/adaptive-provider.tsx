import { useGetAuthUserQuery } from "@/modules/auth/use-get-auth-user-query";
import { adaptiveAppConfig } from "./adaptive-app-config";
import { AdaptiveProvider as _AdaptiveProvider } from "./adaptive-core-provider";
import { AdapiveIdentityProvider } from "./adaptive-identity-provider";

export const AdapiveProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: authUser } = useGetAuthUserQuery();

  console.log("AUTH USER", authUser);
  return (
    <_AdaptiveProvider
      domain={new URL(window.location.href)?.host || "*"}
      apiKey={adaptiveAppConfig.apiKey}
      apiUrl={adaptiveAppConfig.apiUrl}
      identity={{
        email: "todo",
      }}
    >
      <AdapiveIdentityProvider>{children}</AdapiveIdentityProvider>
    </_AdaptiveProvider>
  );
};
