import { signUp } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";
import { signUpCredentialsSchema, SignUpCredentials } from "./auth.types";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      // Validate input against schema before API call
      signUpCredentialsSchema.parse(credentials);
      
      return await signUp({
        username: credentials.email,
        password: credentials.password,
        attributes: {
          given_name: credentials.firstName,
          family_name: credentials.lastName,
          email: credentials.email,
        },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};
