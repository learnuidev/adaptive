import { confirmSignUp } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";
import { confirmRegistrationSchema, ConfirmRegistration } from "./auth.types";

export const useConfirmRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (confirmation: ConfirmRegistration) => {
      // Validate input against schema before API call
      confirmRegistrationSchema.parse(confirmation);
      
      return await confirmSignUp({
        username: confirmation.email,
        confirmationCode: confirmation.confirmationCode,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};
