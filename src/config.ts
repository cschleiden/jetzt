import { log, LogLevel } from "./log";

export interface StorageConfig {
  account: string;
  container: string;
  url: string;
}

export interface FunctionConfig {}

export interface JetztConfig {
  storage: StorageConfig;
  functionApp: FunctionConfig;
}

export function checkConfig(config: JetztConfig): void {
  // Storage configuration
  if (!config.storage) {
    fail("storage");
  }

  if (!config.storage.account) {
    fail("storage/account");
  }

  if (!config.storage.container) {
    fail("storage/container");
  }

  if (!config.storage.url) {
    fail("storage/url");
  }

  // Function configuration
  if (!config.functionApp) {
    fail("functionApp");
  }
}

function fail(section: string) {
  throw new Error(`Config is missing '${section}'`);
}
