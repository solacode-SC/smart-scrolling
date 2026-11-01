import { z } from "zod";

export const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  font: z.enum(["Geist", "Inter", "Roboto", "System"]).default("Geist"),
  fontSize: z.enum(["S", "M", "L"]).default("M"),
  feedDensity: z
    .enum(["compact", "comfortable", "spacious"])
    .default("comfortable"),
  cardStyle: z.enum(["minimal", "standard"]).default("standard"),
  contentWidth: z.enum(["narrow", "standard", "wide"]).default("standard"),
  defaultSort: z.enum(["newest", "oldest"]).default("newest"),
  autoplay: z.boolean().default(false),
  embedLoading: z
    .enum(["click-to-load", "load-when-visible"])
    .default("click-to-load"),
  sidebarState: z.enum(["expanded", "collapsed"]).default("expanded"),
  syncEnabled: z.boolean().default(true),
  syncIntervalMinutes: z.number().min(5).max(1440).default(30),
  notificationsEnabled: z.boolean().default(true),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;
