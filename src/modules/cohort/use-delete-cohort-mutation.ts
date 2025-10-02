import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { listCohortsQueryKey } from "./use-list-cohorts-query";

const deleteCohortSchema = z.object({
  id: z.ulid(),
  websiteId: z.ulid(),
});

export type DeleteCohortParam = z.infer<typeof deleteCohortSchema>;

const deleteCohort = async (input: DeleteCohortParam): Promise<void> => {
  // Validate input against schema before deleting
  deleteCohortSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/delete-cohort`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
};

export const useDeleteCohortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteCohortParam) => {
      return deleteCohort(input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [listCohortsQueryKey, variables.websiteId],
      });
    },
  });
};
