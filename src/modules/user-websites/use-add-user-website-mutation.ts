import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { UserWebsite } from "./user-website.types";
import { listUserWebsitesQueryId } from "./use-list-user-websites-query";

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

export const addUserWebsiteParamSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  domain: z.string().min(1),
  scopes: z.array(z.enum(["read", "write", "*"])),
  timeZone: z.string().min(1),
});

export type AddUserWebsiteParam = z.infer<typeof addUserWebsiteParamSchema>;

const addUserWebsite = async (
  input: AddUserWebsiteParam
): Promise<UserWebsite> => {
  // Validate input against schema before posting
  addUserWebsiteParamSchema.parse(input);

  const res = await fetchWithToken(`${appConfig.apiUrl}/v1/add-user-website`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as UserWebsite;
};
export const useAddUserWebsiteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddUserWebsiteParam) => {
      return addUserWebsite(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [listUserWebsitesQueryId] });
    },
  });
};
