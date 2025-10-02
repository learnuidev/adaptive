import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { Cohort } from "./cohort.types";

const listCohorts = async (websiteId: string): Promise<Cohort[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-cohorts`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Cohort[];
};

export const listCohortsQueryKey = "list-cohorts";

export function useListCohortsQuery(websiteId: string) {
  return useQuery({
    queryKey: [listCohortsQueryKey, websiteId],
    queryFn: () => listCohorts(websiteId),
  });
}
