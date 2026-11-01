import {
  Platform,
  ConnectorCapability,
  ConnectorState,
  ProfileValidation,
  SocialProfile,
  FetchPostsResult,
  EmbedData,
  NormalizedPost,
  ConnectedAccountData,
  SocialConnector,
} from "@socialhub/shared";

export abstract class BaseSocialConnector implements SocialConnector {
  abstract readonly platform: Platform;
  abstract readonly capabilities: ConnectorCapability[];
  abstract readonly state: ConnectorState;

  abstract validateProfile(input: string): Promise<ProfileValidation>;
  abstract getProfile(identifier: string): Promise<SocialProfile>;
  abstract fetchPosts(
    account: ConnectedAccountData,
    cursor?: string,
  ): Promise<FetchPostsResult>;
  abstract getEmbed(post: NormalizedPost): Promise<EmbedData | null>;

  async refreshAuthentication?(): Promise<void> {
    // Default no-op
  }
}
