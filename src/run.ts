import { join, resolve } from "path";
import { build } from "./build";
import { getJetztConfig } from "./config";
import { deploy } from "./deploy";
import { runStep } from "./lib/step";
import { Mode, ModeFlags } from "./mode";

export async function run(path: string, mode: Mode) {
  // Get configurations
  const config = await runStep(`Looking for configuration...`, () =>
    getJetztConfig(path)
  );

  // Build
  if (mode.mode & ModeFlags.Build) {
    await build(config);
  }

  // Deploy
  if (mode.mode & ModeFlags.Deploy) {
    await deploy(config);
  }
}
