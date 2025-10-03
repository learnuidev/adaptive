import { z } from "zod";

export const AddNoteInputSchema = z.object({
  userId: z.string(),
  websiteId: z.string(),
  text: z.string(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type AddNoteInput = z.infer<typeof AddNoteInputSchema>;

export type Note = AddNoteInput & {
  id: string;
};
