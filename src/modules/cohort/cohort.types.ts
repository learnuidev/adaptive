import { z } from "zod";

export const cohortSchema = z
  .object({
    id: z.ulid(),
    websiteId: z.ulid(),
    name: z.string().min(1),
    cohortRules: z
      .array(z.record(z.string(), z.unknown()))
      .nullable()
      .optional(),
    createdAt: z.number(),
  })
  .strict();

export const addCohortSchema = cohortSchema.omit({ id: true, createdAt: true });
export type AddCohortInput = z.infer<typeof addCohortSchema>;

export type Cohort = z.infer<typeof cohortSchema>;
