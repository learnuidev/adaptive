import { getAmplifyIsAuthenticated } from "@/lib/aws-smplify/amplify-auth";
import { useQuery } from "@tanstack/react-query";

export const isAuthenticatedQueryKey = `is-authenticated`;

export const useIsAuthenticatedQuery = () => {
  return useQuery({
    queryKey: [isAuthenticatedQueryKey],

    queryFn: () => {
      return getAmplifyIsAuthenticated();
    },
  });
};
