import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AcceptInvitationRequest {
  token: string;
}

interface AcceptInvitationResponse {
  success: boolean;
  data: {
    message: string;
    teamMember: {
      id: string;
      websiteId: string;
      role: string;
      addedAt: string;
    };
  };
}

export const useAcceptInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      token,
    }: AcceptInvitationRequest): Promise<AcceptInvitationResponse> => {
      const response = await fetchWithToken(
        `${appConfig.apiUrl}/v1/team-invitations/accept`,
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
        throw new Error(error.error || "Failed to accept invitation");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to accept invitation");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["teamInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
