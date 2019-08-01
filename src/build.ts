// Require next from the folder we're running in
// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;

const archiver = require("archiver");
import fse, { createWriteStream } from "fs-extra";
import { join, resolve } from "path";
import { checkConfig, JetztConfig } from "./config";
import { log, LogLevel } from "./log";
import { NextBuild } from "./next";
import { parseNextJsConfig } from "./parseNextConfig";
import { functionJson, handler, hostJson, proxiesJson } from "./templates";

export async function build(path: string) {
  // Build paths
  const sourcePath = resolve(path);
  const buildOutputPath = join(sourcePath, "build");
  const buildPagesOutputPath = join(buildOutputPath, "pages");
  const buildAssetsOutputPath = join(buildOutputPath, "assets");

  // Get configurations
  const nextConfig = await runStep(`Parsing Next.js config...`, () =>
    parseNextJsConfig(path)
  );
  const config = await runStep(`Looking for jetzt configuration...`, () =>
    getJetztConfig()
  );

  // Build!
  const buildResult = await runStep(`Building Next.js project...`, () =>
    buildNextProject(sourcePath, buildPagesOutputPath, nextConfig)
  );

  // Process build result
  await runStep(`Processing SSR pages...`, () => processSSRPages(buildResult));

  await runStep(`Generating proxy configuration...`, () =>
    generateProxies(buildResult, buildPagesOutputPath, config)
  );
  await runStep(`Generating host configuration...`, () =>
    generateHostConfig(buildPagesOutputPath)
  );

  await runStep(`Copying static assets`, () =>
    copyStaticAssets(sourcePath, buildAssetsOutputPath, buildResult)
  );

  await runStep(`Building Azure functions package`, () =>
    createPackage(buildPagesOutputPath, buildOutputPath)
  );

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

async function runStep<T>(
  description: string,
  step: () => Promise<T>
): Promise<T> {
  log(description);
  const result = await step();
  log(`Done.`, LogLevel.Verbose);

  return result;
}

async function getJetztConfig() {
  if (!(await fse.pathExists("./jetzt.config.json"))) {
    throw new Error("Could not find `jetzt.config.json`");
  }

  const config: JetztConfig = JSON.parse(
    await fse.readFile("./jetzt.config.json", "utf-8")
  );
  checkConfig(config);

  return config;
}

async function buildNextProject(
  sourcePath: string,
  buildPagesOutputPath: string,
  nextConfig: unknown
) {
  try {
    const buildResult = await nextBuild(sourcePath, nextConfig);
  } catch (e) {
    throw e;
  }

  const buildOutput = new NextBuild(sourcePath);
  await buildOutput.init(buildPagesOutputPath);

  return buildOutput;
}

async function processSSRPages(buildResult: NextBuild) {
  // Wrap non-static pages in custom handler
  for (const page of buildResult.pages.filter(
    p => !p.isStatic && !p.isDynamicallyRouted && !p.isSpecial
  )) {
    log(`Processing ${page.pageName}`, LogLevel.Verbose);

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
}

async function generateProxies(
  buildOutput: NextBuild,
  buildPagesOutputPath: string,
  config: JetztConfig
): Promise<void> {
  // Generate proxies
  await fse.writeFile(
    join(buildPagesOutputPath, "proxies.json"),
    proxiesJson(config.storage.url, buildOutput.pages),
    {
      encoding: "utf-8"
    }
  );
}

async function generateHostConfig(buildPath: string): Promise<void> {
  // Generate host config
  await fse.writeFile(join(buildPath, "host.json"), hostJson(), {
    encoding: "utf-8"
  });
}

async function copyStaticAssets(
  sourcePath: string,
  buildAssetOutputPath: string,
  buildResult: NextBuild
) {
  log(`Copying runtime JS...`, LogLevel.Verbose);
  await fse.copy(
    join(sourcePath, ".next/static"),
    join(buildAssetOutputPath, "static")
  );

  log(`Copying static pages...`, LogLevel.Verbose);
  for (const staticPage of buildResult.pages.filter(p => p.isStatic)) {
    await fse.copy(
      staticPage.pageSourcePath,
      join(buildAssetOutputPath, "pages", staticPage.targetPageFileName)
    );
  }
}

async function createPackage(sourcePath: string, outputPath: string) {
  const packageFilename = "package.zip";

  await new Promise((resolve, reject) => {
    const output = createWriteStream(join(outputPath, packageFilename));
    output.on("finish", resolve);
    output.on("error", reject);

    const archive = archiver("zip", {
      zlib: { level: 0 }
    });

    archive
      .glob(`**/*`, {
        ignore: packageFilename,
        cwd: sourcePath
      })
      .on("error", reject)
      .pipe(output);
    archive.finalize();
  });

  await fse.writeFile(join(outputPath, "packagename.txt"), packageFilename, {
    encoding: "utf-8"
  });

  // Clean up directories
  await fse.remove(sourcePath);
}
