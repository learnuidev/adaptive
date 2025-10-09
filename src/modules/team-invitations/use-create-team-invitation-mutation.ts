import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInvitationRequestSchema, TeamInvitation } from "adaptive.fyi";
import { z } from "zod";
import {
  getPendingInvitationsQueryId,
  listTeamInvitationsQueryId,
} from "./use-list-team-invitations-query";

export const createTeamInvitationParamSchema = CreateInvitationRequestSchema;

export type CreateTeamInvitationParam = z.infer<
  typeof createTeamInvitationParamSchema
>;

const createTeamInvitation = async (
  input: CreateTeamInvitationParam
): Promise<TeamInvitation> => {
  // Validate input against schema before posting
  createTeamInvitationParamSchema.parse(input);

  const res = await fetchWithToken(`${appConfig.apiUrl}/v1/team-invitations`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create invitation: ${res.statusText}`
    );
  }

  const resp = await res.json();
  return resp.data as TeamInvitation;
};

export const useCreateTeamInvitationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTeamInvitationParam) => {
      return createTeamInvitation(input);
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: [listTeamInvitationsQueryId, { websiteId: data.websiteId }],
      });
      queryClient.invalidateQueries({
        queryKey: [getPendingInvitationsQueryId],
      });
    },
  });
};
