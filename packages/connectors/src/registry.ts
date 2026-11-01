import { Platform, SocialConnector } from "@socialhub/shared";

export class ConnectorRegistry {
  private static instance: ConnectorRegistry;
  private connectors = new Map<Platform, SocialConnector>();

  private constructor() {}

  public static getInstance(): ConnectorRegistry {
    if (!ConnectorRegistry.instance) {
      ConnectorRegistry.instance = new ConnectorRegistry();
    }
    return ConnectorRegistry.instance;
  }

  public register(connector: SocialConnector): void {
    this.connectors.set(connector.platform, connector);
  }

  public get(platform: Platform): SocialConnector | undefined {
    return this.connectors.get(platform);
  }

  public getAll(): SocialConnector[] {
    return Array.from(this.connectors.values());
  }

  public has(platform: Platform): boolean {
    return this.connectors.has(platform);
  }
}
