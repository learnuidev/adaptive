import { signIn } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      return await signIn({
        username: email,
        password,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};