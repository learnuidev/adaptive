import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { listCohortsQueryKey } from "./use-list-cohorts-query";
import { addCohortSchema, Cohort } from "./cohort.types";

export type AddCohortParam = z.infer<typeof addCohortSchema>;

const addCohort = async (input: AddCohortParam): Promise<Cohort> => {
  // Validate input against schema before posting
  addCohortSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/add-cohort`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Cohort;
};

export const useAddCohortMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCohortParam) => {
      return addCohort(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [listCohortsQueryKey, data.websiteId],
      });
    },
  });
};
