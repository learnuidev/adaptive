import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCredential } from "./user-credential.types";
import { listUserCredentialsQueryId } from "./use-list-user-credentials-query";
import { z } from "zod";

type Scope = "read" | "write" | "*";
export const possibleScopes = [
  { name: "Read", value: "read" },
  { name: "Write", value: "write" },
  { name: "All", value: "*" },
] as const;

const sampleData = {
  title: "Mandarino",
  description: "Mandarino API Credentials",
  domain: "www.mandarino.io",
  scopes: ["read", "write"],
};

export const addUserCredentialParamSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  domain: z.string().min(1),
  scopes: z.array(z.enum(["read", "write", "*"])),
});

export type AddUserCredentialParam = z.infer<
  typeof addUserCredentialParamSchema
>;

const addUserCredential = async (
  input: AddUserCredentialParam
): Promise<UserCredential> => {
  // Validate input against schema before posting
  addUserCredentialParamSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/add-user-credential`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as UserCredential;
};
export const useAddUserCredentialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddUserCredentialParam) => {
      return addUserCredential(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [listUserCredentialsQueryId] });
      console.log(data);
    },
  });
};
