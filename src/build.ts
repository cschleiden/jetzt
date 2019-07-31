// Require next from the folder we're running in
// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;

import fse, { fchownSync } from "fs-extra";
import { join, resolve } from "path";
import { checkConfig, JetztConfig } from "./config";
import { log, LogLevel } from "./log";
import { NextBuild } from "./next";
import { parseNextJsConfig } from "./parseNextConfig";
import { functionJson, handler, hostJson, proxiesJson } from "./templates";

export async function build(path: string) {
  const nextConfig = parseNextJsConfig(path);

  log(`Looking for jetzt configuration...`);
  if (!(await fse.pathExists("./jetzt.config.json"))) {
    throw new Error("Could not find `jetzt.config.json`");
  }

  const config: JetztConfig = JSON.parse(
    await fse.readFile("./jetzt.config.json", "utf-8")
  );
  checkConfig(config);
  log(`Found configuration.`);

  log(`Building Next.js project...`);

  const resolvedPath = resolve(path);
  try {
    const buildResult = await nextBuild(resolvedPath, nextConfig);
    console.log(JSON.stringify(buildResult, undefined, 2));
  } catch (e) {
    console.error(e);
  }

  // TODO: Standardize the build output logic here?
  const buildOutput = new NextBuild(resolvedPath);
  await buildOutput.init("build");

  log(`Done.`);

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
      functionJson(),
      {
        encoding: "utf-8"
      }
    );
  }

  log(`Done.`);

  log(`Generating proxies and host config...`);

  // Generate proxies
  await fse.writeFile(
    join(resolvedPath, "build", "proxies.json"),
    proxiesJson(config.storage.url, buildOutput.pages),
    {
      encoding: "utf-8"
    }
  );

  // Generate host config
  await fse.writeFile(join(resolvedPath, "build", "host.json"), hostJson(), {
    encoding: "utf-8"
  });

  log(`Done.`);

  log(`Copying static assets`);

  log(`Copying runtime JS...`, LogLevel.Verbose);
  await fse.copy(
    join(resolvedPath, ".next/static"),
    join(resolvedPath, "build", "assets")
  );

  log(`Copying static pages...`, LogLevel.Verbose);
  for (const staticPage of buildOutput.pages.filter(p => p.isStatic)) {
    await fse.copy(
      staticPage.pageSourcePath,
      join(resolvedPath, "build", "pages", `${staticPage.identifier}.html`)
    );
  }

  log(`Done.`);

  //
  // Azure CLI invocation
  //

  // For simplicity, we're just calling azure cli commands here. It might be better to call Azure
  // REST API commands directly, but that's something to investigate in the future.

  // Check for Azure CLI

  // Upload static assets + pages to blob storage

  // Upload function package
  // TODO: Handle Linux/Windows?
}
