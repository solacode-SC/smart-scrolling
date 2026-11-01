export type ThemePreference = "light" | "dark" | "system";
export type FontPreference = "Geist" | "Inter" | "Roboto" | "System";
export type FontSizePreference = "S" | "M" | "L";
export type FeedDensityPreference = "compact" | "comfortable" | "spacious";
export type CardStylePreference = "minimal" | "standard";
export type ContentWidthPreference = "narrow" | "standard" | "wide";
export type EmbedLoadingPreference = "click-to-load" | "load-when-visible";

export interface UserPreferencesData {
  theme: ThemePreference;
  font: FontPreference;
  fontSize: FontSizePreference;
  feedDensity: FeedDensityPreference;
  cardStyle: CardStylePreference;
  contentWidth: ContentWidthPreference;
  defaultSort: "newest" | "oldest";
  autoplay: boolean;
  embedLoading: EmbedLoadingPreference;
  sidebarState: "expanded" | "collapsed";
  syncEnabled: boolean;
  syncIntervalMinutes: number;
  notificationsEnabled: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferencesData;
}
