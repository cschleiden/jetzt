// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;
import { resolve, join } from "path";
import { parseNextJsConfig } from "./parseNextConfig";
import { NextBuild } from "./next";

export async function build(path: string) {
  const config = parseNextJsConfig(path);

  console.log(path, config);

  const resolvedPath = resolve(path);
  try {
    await nextBuild(resolvedPath, config);
  } catch (e) {
    console.error(e);
  }

  // TODO: Standardize the build output logic here?
  const buildOutput = new NextBuild(join(resolvedPath, ".next"));
  await buildOutput.init();
  console.log(buildOutput.pages);
}
