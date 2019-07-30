// Require next from the folder we're running in
// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;
import fse from "fs-extra";
import { join, resolve, basename, dirname } from "path";
import { NextBuild } from "./next";
import { parseNextJsConfig } from "./parseNextConfig";
import { handler, functionJson } from "./templates";
import { log, CurrentLogLevel, LogLevel } from "./log";

export async function build(path: string) {
  const config = parseNextJsConfig(path);

  log(`Building Next.js project...`);

  const resolvedPath = resolve(path);
  try {
    const buildResult = await nextBuild(resolvedPath, config);
    console.log(JSON.stringify(buildResult, undefined, 2));
  } catch (e) {
    console.error(e);
  }

  // TODO: Standardize the build output logic here?
  const buildOutput = new NextBuild(resolvedPath);
  await buildOutput.init("build");

  log(`Processing pages...`);

  // Wrap non-static pages in custom handler
  // TODO: Handle static/dynamic pages
  for (const page of buildOutput.pages.filter(
    p => !p.isStatic && !p.isDynamicallyRouted && !p.isSpecial
  )) {
    log(`Processing ${page.pageName}`);

    // Copying to new folder
    log(`Copying to new file ${page.targetPath}`, LogLevel.Verbose);
    await fse.copy(page.pageSourcePath, page.targetPath);

    // Wrapping with handler
    log(
      `Writing new handler wrapping ${page.targetPageFileName}...`,
      LogLevel.Verbose
    );
    await fse.writeFile(
      join(page.targetFolder, "index.js"),
      handler(page.targetPageFileName),
      {
        encoding: "utf-8"
      }
    );

    // Adding function declaration
    log(`Writing function description...`, LogLevel.Verbose);
    await fse.writeFile(
      join(page.targetFolder, "function.json"),
      functionJson(""),
      {
        encoding: "utf-8"
      }
    );
  }

  // Generate proxies
  // TODO

  // Upload static pages to blob storage?
  // TODO
}
