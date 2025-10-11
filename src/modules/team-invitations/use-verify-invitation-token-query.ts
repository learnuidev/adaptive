import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { useAcceptInvitationMutation } from "./use-accept-invitation-mutation";
import { useRouter } from "@tanstack/react-router";

interface VerifyInvitationResponse {
  valid: boolean;
  data?: {
    invitationId: string;
    email: string;
    websiteId: string;
    timestamp: number;
  };
  error?: string;
}

export const useVerifyInvitationTokenQuery = (token: string) => {
  const acceptUserInvitationMutation = useAcceptInvitationMutation();
  const router = useRouter();

  return useQuery({
    queryKey: ["verifyInvitationToken", token],
    queryFn: async (): Promise<VerifyInvitationResponse> => {
      if (!token) {
        throw new Error("Token is required");
      }

      const response = await fetchWithToken(
        `${appConfig.apiUrl}/v1/team-invitations/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to verify invitation token");
      }

      const respJson = (await response.json()) as VerifyInvitationResponse;

      if (respJson.valid) {
        acceptUserInvitationMutation
          .mutateAsync({ token })
          // .then((resp) => {
          //   router.navigate({ to: `/teams/${respJson?.data?.websiteId}` });
          // })
          .finally(() => {
            router.navigate({ to: `/team/${respJson?.data?.websiteId}` });
          });
      }

      return respJson;
    },
    enabled: !!token,
    retry: false,
  });
};
