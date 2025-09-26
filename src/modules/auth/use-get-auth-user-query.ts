import { getAmplifyIsAuthenticated } from "@/lib/aws-smplify/amplify-auth";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";

export const getAuthUserQueryKey = `auth-user`;

export const useGetAuthUserQuery = () => {
  return useQuery({
    queryKey: [getAuthUserQueryKey],

    queryFn: () => {
      return getCurrentUser();
    },
  });
};
