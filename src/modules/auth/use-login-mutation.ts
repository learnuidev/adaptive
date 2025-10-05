import { signIn } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";
import { loginCredentialsSchema, LoginCredentials } from "./auth.types";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Validate input against schema before API call
      loginCredentialsSchema.parse(credentials);
      
      return await signIn({
        username: credentials.email,
        password: credentials.password,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};
