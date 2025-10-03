import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { listNotesQueryKey } from "./use-list-notes-query";
import { AddNoteInputSchema, AddNoteInput, Note } from "./note.types";

const addNote = async (input: AddNoteInput): Promise<Note> => {
  // Validate input against schema before posting
  AddNoteInputSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/add-note`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Note;
};

export const useAddNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddNoteInput) => {
      return addNote(input);
    },
    onSuccess: (data: Note) => {
      queryClient.invalidateQueries({
        queryKey: [listNotesQueryKey, data.websiteId],
      });
    },
  });
};
