export type FeedVisibility = "PRIVATE" | "UNLISTED" | "PUBLIC";

export type FeedRole = "OWNER" | "MODERATOR" | "MEMBER";

export type FeedMemberStatus = "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";

export interface FeedSourceItem {
  id: string;
  feedId: string;
  connectedAccountId: string;
  createdAt: Date;
}
