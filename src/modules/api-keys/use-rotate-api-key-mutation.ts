import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiKeyWithSecret } from "./api-key.types";
import { listApiKeysQueryId } from "./use-list-api-keys-query";

const rotateApiKey = async (id: string): Promise<ApiKeyWithSecret> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/rotate-api-key`,
    {
      method: "POST",
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
  
  const resp = await res.json();
  return resp as ApiKeyWithSecret;
};

export const useRotateApiKeyMutation = (websiteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return rotateApiKey(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [listApiKeysQueryId, websiteId] 
      });
    },
  });
};
