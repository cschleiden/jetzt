// Require next from the folder we're running in
// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;
import { log } from "console";
import fse from "fs-extra";
import { join, resolve } from "path";
import { NextBuild } from "./next";
import { parseNextJsConfig } from "./parseNextConfig";

export async function build(path: string) {
  const config = parseNextJsConfig(path);

  log(`Building Next.js project`);

  const resolvedPath = resolve(path);
  try {
    await nextBuild(resolvedPath, config);
  } catch (e) {
    console.error(e);
  }

  // TODO: Standardize the build output logic here?
  const buildOutput = new NextBuild(join(resolvedPath, ".next"));
  await buildOutput.init();

  log(`Discovered pages: ${JSON.stringify(buildOutput.pages)}`);

  // Copy to temporary folder
  // TODO: Make path configurable
  await fse.copy(
    join(resolvedPath, ".next/serverless/pages"),
    join(path, "build")
  );

  // Wrap pages in custom handler
  // TODO

  // Generate proxies
  // TODO
}
