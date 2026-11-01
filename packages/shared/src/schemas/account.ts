import { z } from "zod";

export const PreviewAccountSchema = z.object({
  platform: z.enum([
    "YOUTUBE",
    "REDDIT",
    "RSS",
    "X",
    "TIKTOK",
    "INSTAGRAM",
    "FACEBOOK",
    "LINKEDIN",
  ]),
  input: z.string().min(1, "Profile URL or identifier is required"),
});

export type PreviewAccountInput = z.infer<typeof PreviewAccountSchema>;

export const CreateAccountSchema = z.object({
  platform: z.enum([
    "YOUTUBE",
    "REDDIT",
    "RSS",
    "X",
    "TIKTOK",
    "INSTAGRAM",
    "FACEBOOK",
    "LINKEDIN",
  ]),
  externalAccountId: z.string().min(1),
  username: z.string().min(1),
  displayName: z.string().optional(),
  profileUrl: z.string().url(),
  avatarUrl: z.string().url().optional(),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
