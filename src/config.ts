import { log, LogLevel } from "./lib/log";

export class JetztConfig {
  public static parse(content: string): JetztConfig {
    const config = JSON.parse(content);
    return new JetztConfig(config);
  }

  private constructor(private readonly config: Config) {
    this.checkConfig();
  }

  /**
   * Name of the function app
   */
  get name(): string {
    return this.config.functionApp.name;
  }

  get subscriptionId(): string {
    return this.config.functionApp.subscriptionId;
  }

  get location(): string {
    return this.config.functionApp.location;
  }

  get resourceGroup(): string {
    return this.config.functionApp.resourceGroup;
  }

  get storageAccount(): string {
    return this.config.storage.account;
  }

  get assetsContainerName(): string {
    return `${this.config.functionApp.name}-assets`;
  }

  get storageUrl(): string {
    return `https://${this.config.storage.account}.blog.core.windows.net/${
      this.assetsContainerName
    }/`;
  }

  private checkConfig() {
    // Storage configuration
    if (!this.config.storage) {
      fail("storage");
    }

    if (!this.config.storage.account) {
      fail("storage/account");
    }

    // Function configuration
    if (!this.config.functionApp) {
      fail("functionApp");
    }

    if (!this.config.functionApp.subscriptionId) {
      fail("functionApp/subscriptionId");
    }

    if (!this.config.functionApp.resourceGroup) {
      fail("functionApp/resourceGroup");
    }

    if (!this.config.functionApp.name) {
      fail("functionApp/name");
    }

    if (!this.config.functionApp.location) {
      fail("functionApp/location");
    }
  }
}

interface StorageConfig {
  account: string;
}

interface FunctionConfig {
  /**
   * Name of the function app
   */
  name: string;

  /**
   * Id of subscription
   */
  subscriptionId: string;

  /**
   * Name of the resource group to use/create
   */
  resourceGroup: string;

  /**
   * Location for all created resources
   */
  location: string;
}

interface Config {
  storage: StorageConfig;
  functionApp: FunctionConfig;
}

function fail(section: string) {
  throw new Error(`Config is missing '${section}'`);
}
