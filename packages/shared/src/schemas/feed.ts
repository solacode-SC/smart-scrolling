import { z } from "zod";

export const CreateSharedFeedSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(["PRIVATE", "UNLISTED", "PUBLIC"]).default("PUBLIC"),
  allowDirectFollow: z.boolean().default(true),
});

export type CreateSharedFeedInput = z.infer<typeof CreateSharedFeedSchema>;

export const UpdateSharedFeedSchema = CreateSharedFeedSchema.partial();
export type UpdateSharedFeedInput = z.infer<typeof UpdateSharedFeedSchema>;
