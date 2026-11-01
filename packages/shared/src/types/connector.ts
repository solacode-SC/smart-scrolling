import { Platform } from "./platform.js";
import { NormalizedPost } from "./post.js";

export enum ConnectorCapability {
  PROFILE_LOOKUP = "PROFILE_LOOKUP",
  PUBLIC_POST_DISCOVERY = "PUBLIC_POST_DISCOVERY",
  AUTHORIZED_POST_DISCOVERY = "AUTHORIZED_POST_DISCOVERY",
  RSS_DISCOVERY = "RSS_DISCOVERY",
  EMBED_PLAYBACK = "EMBED_PLAYBACK",
  IMAGE_IMPORT = "IMAGE_IMPORT",
  WEBHOOK_SYNC = "WEBHOOK_SYNC",
  PAGINATION = "PAGINATION",
}

export enum ConnectorState {
  SUPPORTED = "SUPPORTED",
  LIMITED = "LIMITED",
  AUTH_REQUIRED = "AUTH_REQUIRED",
  UNAVAILABLE = "UNAVAILABLE",
  DISABLED = "DISABLED",
}

export interface ProfileValidation {
  isValid: boolean;
  normalizedIdentifier?: string;
  errorMessage?: string;
}

export interface SocialProfile {
  identifier: string;
  platform: Platform;
  displayName: string;
  username: string;
  avatarUrl?: string;
  description?: string;
  profileUrl: string;
}

export interface FetchPostsResult {
  posts: NormalizedPost[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface EmbedData {
  html?: string;
  embedUrl: string;
  aspectRatio?: number;
  width?: number;
  height?: number;
  provider: Platform;
}

export interface ConnectedAccountData {
  id: string;
  platform: Platform;
  externalAccountId: string;
  username: string;
  category?: string | null;
  credentials?: Record<string, unknown> | null;
}

export interface SocialConnector {
  readonly platform: Platform;
  readonly capabilities: ConnectorCapability[];
  readonly state: ConnectorState;
  validateProfile(input: string): Promise<ProfileValidation>;
  getProfile(identifier: string): Promise<SocialProfile>;
  fetchPosts(
    account: ConnectedAccountData,
    cursor?: string,
  ): Promise<FetchPostsResult>;
  getEmbed(post: NormalizedPost): Promise<EmbedData | null>;
  refreshAuthentication?(): Promise<void>;
}
