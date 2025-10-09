import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TeamInvitation,
  UpdateInvitationStatusRequestSchema,
} from "adaptive.fyi";
import { z } from "zod";
import {
  getPendingInvitationsQueryId,
  listTeamInvitationsQueryId,
} from "./use-list-team-invitations-query";
import { InvitationStatus } from "@/components/team/team-invitation.types";

export const updateInvitationStatusParamSchema =
  UpdateInvitationStatusRequestSchema;

export type UpdateInvitationStatusParam = z.infer<
  typeof updateInvitationStatusParamSchema
>;

const updateInvitationStatus = async (
  input: UpdateInvitationStatusParam
): Promise<TeamInvitation> => {
  // Validate input against schema before posting
  updateInvitationStatusParamSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/team-invitations/status`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update invitation: ${res.statusText}`
    );
  }

  const resp = await res.json();
  return resp.data as TeamInvitation;
};

export const useUpdateInvitationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateInvitationStatusParam) => {
      return updateInvitationStatus(input);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: [listTeamInvitationsQueryId],
      });
      queryClient.invalidateQueries({
        queryKey: [getPendingInvitationsQueryId],
      });

      // Also invalidate specific website and email queries
      if (data.websiteId) {
        queryClient.invalidateQueries({
          queryKey: [listTeamInvitationsQueryId, { websiteId: data.websiteId }],
        });
      }

      if (data.email) {
        queryClient.invalidateQueries({
          queryKey: [listTeamInvitationsQueryId, { email: data.email }],
        });
        queryClient.invalidateQueries({
          queryKey: [getPendingInvitationsQueryId, { email: data.email }],
        });
      }
    },
  });
};

// Convenience mutations for specific actions
export const useAcceptInvitationMutation = () => {
  const updateMutation = useUpdateInvitationStatusMutation();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      return updateMutation.mutateAsync({
        invitationId,
        status: InvitationStatus.ACCEPTED,
      });
    },
  });
};

export const useRejectInvitationMutation = () => {
  const updateMutation = useUpdateInvitationStatusMutation();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      return updateMutation.mutateAsync({
        invitationId,
        status: InvitationStatus.REJECTED,
      });
    },
  });
};
