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
