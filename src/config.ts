import fse from "fs-extra";
import { join, resolve } from "path";
import { configPrompt } from "./config/configPrompt";
import { log } from "./lib/log";

export async function getJetztConfig(path: string) {
  const sourcePath = resolve(path);
  if (!(await fse.pathExists(join(sourcePath, "jetzt.config.json")))) {
    log("Could not find configuration.");
    debugger;

    const config = await configPrompt(sourcePath);
    if (!config) {
      // Prompt was aborted, throw error.
      throw new Error("Could not find `jetzt.config.json`");
    }

    return config;
  } else {
    return JetztConfig.parse(
      sourcePath,
      await fse.readFile(join(sourcePath, "jetzt.config.json"), "utf-8")
    );
  }
}

export class JetztConfig {
  public static parse(sourcePath: string, content: string): JetztConfig {
    const config = JSON.parse(content);
    return new JetztConfig(sourcePath, config);
  }

  public static async write(sourcePath: string, config: Config) {
    await fse.writeFile(
      join(sourcePath, "jetzt.config.json"),
      JSON.stringify(config, undefined, 2)
    );
  }

  public constructor(
    public readonly sourcePath: string,
    private readonly config: Config
  ) {
    this.checkConfig();
  }

  get buildOutputPath() {
    return join(this.sourcePath, "build");
  }
  get buildPagesOutputPath() {
    return join(this.buildOutputPath, "pages");
  }
  get buildAssetsOutputPath() {
    return join(this.buildOutputPath, "assets");
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
    return `https://${this.config.storage.account}.blob.core.windows.net/${
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

export interface StorageConfig {
  account: string;
}

export interface FunctionConfig {
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

export interface Config {
  storage: StorageConfig;
  functionApp: FunctionConfig;
}

function fail(section: string) {
  throw new Error(`Config is missing '${section}'`);
}
