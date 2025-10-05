import { getAmplifyIsAuthenticated } from "@/lib/aws-smplify/amplify-auth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAttributes } from "aws-amplify/auth";
import { UserProfile } from "./auth.types";

export const getAuthUserQueryKey = `auth-user`;

export const useGetAuthUserQuery = () => {
  return useQuery({
    queryKey: [getAuthUserQueryKey],
    queryFn: async (): Promise<UserProfile | null> => {
      try {
        const attributes = await fetchUserAttributes();
        return attributes as UserProfile;
      } catch (error) {
        return null;
      }
    },
  });
};
