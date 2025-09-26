import { confirmSignUp, signUp } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";

export const useConfirmRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      confirmationCode,
    }: {
      email: string;
      confirmationCode: string;
    }) => {
      return await confirmSignUp({
        username: email,
        confirmationCode,
        // attributes: {
        //   given_name: firstName,
        //   family_name: lastName,
        //   email,
        // },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the authentication status
      queryClient.invalidateQueries({ queryKey: [isAuthenticatedQueryKey] });
    },
  });
};
