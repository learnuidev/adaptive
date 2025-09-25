import { signOut } from "@/lib/aws-smplify/amplify-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedQueryKey } from "./use-is-authenticated.query";

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await signOut();
    },
    onSuccess: () => {
      // Clear authentication cache
      queryClient.setQueryData([isAuthenticatedQueryKey], false);
      queryClient.clear();
    },
  });
};