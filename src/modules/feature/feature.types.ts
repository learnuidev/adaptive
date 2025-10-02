import { z } from "zod";

export const addFeatureSchema = z.object({
  name: z.string().min(1),
  featureKey: z.string().min(1),
  description: z.string().optional(),
  userId: z.string().email(),
  tags: z.array(z.string()).optional(),
  websiteId: z.ulid(),
  featureKeyAndWebsiteId: z.string().min(1),
});

export type AddFeatureInput = z.infer<typeof addFeatureSchema>;

export type Feature = AddFeatureInput & {
  id: string;
  createdAt: number;
};

export const addFeatureVersionSchema = z
  .object({
    featureId: z.string().uuid(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, {
      message: "Must be a semantic version (e.g., 1.2.3)",
    }),
    config: z.record(z.string(), z.unknown()),
    isActive: z.boolean().default(false),
    rolloutPercentage: z.number().int().min(0).max(100).nullable().optional(),
    rolloutRules: z
      .array(z.record(z.string(), z.unknown()))
      .nullable()
      .optional(),
    createdBy: z.string().uuid(),
  })
  .strict();
export type FeatureVersion = z.infer<typeof addFeatureVersionSchema>;
