import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { Note } from "./note.types";

const listNotes = async (websiteId: string): Promise<Note[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-notes`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Note[];
};

export const listNotesQueryKey = "list-notes";

export function useListNotesQuery(websiteId: string) {
  return useQuery({
    queryKey: [listNotesQueryKey, websiteId],
    queryFn: () => listNotes(websiteId),
  });
}
