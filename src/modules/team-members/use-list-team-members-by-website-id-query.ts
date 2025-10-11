import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const listTeamMembersByWebsiteIdQueryId = "team-members-by-website-id";

const TeamMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().optional(),
  websiteId: z.string(),
  role: z.string(),
  addedBy: z.string(),
  addedAt: z.string(),
  lastActiveAt: z.string(),
  status: z.string(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

const listTeamMembersByWebsiteIdParamSchema = z.object({
  websiteId: z.string().min(1),
});

export type ListTeamMembersByWebsiteIdParam = z.infer<
  typeof listTeamMembersByWebsiteIdParamSchema
>;

const listTeamMembersByWebsiteId = async (
  params: ListTeamMembersByWebsiteIdParam
): Promise<TeamMember[]> => {
  // Validate input against schema
  listTeamMembersByWebsiteIdParamSchema.parse(params);

  const url = `${appConfig.apiUrl}/v1/websites/${params.websiteId}/team-members`;

  const res = await fetchWithToken(url, {
    method: "GET",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to list team members: ${res.statusText}`
    );
  }

  const resp = await res.json();

  // Validate and return the data
  // const teamMembers = z.array(TeamMemberSchema).parse(resp.data);
  return resp.data;
};

export const useListTeamMembersByWebsiteIdQuery = (
  websiteId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: [listTeamMembersByWebsiteIdQueryId, websiteId],
    queryFn: () => listTeamMembersByWebsiteId({ websiteId }),
    enabled: !!websiteId && options?.enabled !== false,
  });
};
