import { Platform } from "./platform.js";

export type PostType =
  "TEXT" | "IMAGE" | "GALLERY" | "VIDEO" | "LINK" | "ARTICLE";

export interface PostMediaItem {
  type: string;
  url?: string;
  embedUrl?: string;
  width?: number;
  height?: number;
}

export interface PostExternalAuthor {
  username: string;
  displayName?: string;
  profileImage?: string;
}

export interface NormalizedPost {
  externalId: string;
  platform: Platform;
  accountId: string;
  type: PostType;
  title?: string;
  text?: string;
  caption?: string;
  originalUrl: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  publishedAt: Date; // stored UTC
  externalAuthor: PostExternalAuthor;
  media: PostMediaItem[];
  engagement?: Record<string, number>; // only where authorized
  rawMetadata?: Record<string, unknown>;
}
