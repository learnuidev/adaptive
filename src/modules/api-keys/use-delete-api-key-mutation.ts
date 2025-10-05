import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listApiKeysQueryId } from "./use-list-api-keys-query";

const deleteApiKey = async (id: string): Promise<void> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/delete-api-key`,
    {
      method: "POST",
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
};

export const useDeleteApiKeyMutation = (websiteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return deleteApiKey(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [listApiKeysQueryId, websiteId] 
      });
    },
  });
};
