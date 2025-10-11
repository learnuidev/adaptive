import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Team } from "adaptive.fyi";
import { toast } from "sonner";
import { z } from "zod";

export const CreateTeamRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>;

interface CreateTeamResponse {
  success: boolean;
  data: Team;
}

export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      request: CreateTeamRequest
    ): Promise<CreateTeamResponse> => {
      const response = await fetchWithToken(`${appConfig.apiUrl}/v1/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create team");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create team");
      }

      return result;
    },
    onSuccess: (data) => {
      toast.success(`Team "${data.data.name}" created successfully!`);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["userTeams"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
