import { InvitationStatus } from "@/components/team/team-invitation.types";
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { ListInvitationsResponse } from "adaptive.fyi";
import { z } from "zod";

export const listTeamInvitationsQueryId = "team-invitations";

const listTeamInvitationsParamSchema = z.object({
  websiteId: z.string().optional(),
  status: z.nativeEnum(InvitationStatus).optional(),
  email: z.string().email().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type ListTeamInvitationsParam = z.infer<
  typeof listTeamInvitationsParamSchema
>;

const listTeamInvitations = async (
  params: ListTeamInvitationsParam
): Promise<ListInvitationsResponse> => {
  // Validate input against schema
  listTeamInvitationsParamSchema.parse(params);

  const searchParams = new URLSearchParams();

  if (params.websiteId) searchParams.append("websiteId", params.websiteId);
  if (params.status) searchParams.append("status", params.status);
  if (params.email) searchParams.append("email", params.email);
  searchParams.append("limit", params.limit.toString());
  searchParams.append("offset", params.offset.toString());

  const url = `${appConfig.apiUrl}/v1/team-invitations?${searchParams.toString()}`;

  const res = await fetchWithToken(url, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to list invitations: ${res.statusText}`
    );
  }

  const resp = await res.json();
  return { invitations: resp.data } as ListInvitationsResponse;
};

export const useListTeamInvitationsQuery = (
  params: ListTeamInvitationsParam
) => {
  return useQuery({
    queryKey: [listTeamInvitationsQueryId, params],
    queryFn: () => listTeamInvitations(params),
    enabled: !!params.websiteId || !!params.email, // Only enable if we have a websiteId or email
  });
};

// Convenience hook for website invitations
export const useWebsiteInvitationsQuery = (
  websiteId: string,
  status?: InvitationStatus
) => {
  return useListTeamInvitationsQuery({
    websiteId,
    status,
    limit: 50,
    offset: 0,
  });
};

// Convenience hook for pending invitations
export const getPendingInvitationsQueryId = "pending-team-invitations";

export const usePendingInvitationsQuery = (email: string) => {
  return useListTeamInvitationsQuery({
    email,
    status: InvitationStatus.PENDING,
    limit: 50,
    offset: 0,
  });
};
