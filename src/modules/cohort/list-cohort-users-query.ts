import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

export interface CohortUser {
  email?: string;
}

const listCohortUsers = async (cohortId: string): Promise<CohortUser[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-cohort-users`,
    {
      method: "POST",
      body: JSON.stringify({ cohortId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as CohortUser[];
};

export const listCohortUsersQueryKey = "list-cohort-users";

export function useListCohortUsersQuery(cohortId: string) {
  return useQuery({
    queryKey: [listCohortUsersQueryKey, cohortId],
    queryFn: () => listCohortUsers(cohortId),
    enabled: !!cohortId,
  });
}
