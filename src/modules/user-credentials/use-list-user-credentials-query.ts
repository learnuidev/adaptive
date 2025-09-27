import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useQuery } from "@tanstack/react-query";
import { UserCredential } from "./user-credential.types";

const listUserCredentials = async (): Promise<UserCredential[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/list-user-credentials`,
    {
      method: "POST",

      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
  const resp = await res.json();
  return resp as UserCredential[];
};

export const listUserCredentialsQueryId = "list-user-credentials";
export const useListUserCredentialsQuery = () => {
  return useQuery({
    queryKey: [listUserCredentialsQueryId],
    queryFn: async () => {
      return listUserCredentials();
    },
  });
};
