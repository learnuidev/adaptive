import { z } from "zod";

export const AddNoteInputSchema = z.object({
  websiteId: z.string(),
  dataPoint: z.string(),
  text: z.string(),
});

export type AddNoteInput = z.infer<typeof AddNoteInputSchema>;

export type Note = AddNoteInput & {
  id: string;
  //   gets added when note is created
  createdAt: number;
  updatedAt: number;
  userId: string;
};
