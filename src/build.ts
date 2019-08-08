// Require next from the folder we're running in
// @ts-ignore
const nextBuild = require.main.require("next/dist/build").default;

const archiver = require("archiver");
import fse, { createWriteStream } from "fs-extra";
import { join } from "path";
import { JetztConfig } from "./config";
import { log, LogLevel } from "./lib/log";
import { runStep } from "./lib/step";
import { NextBuild } from "./next";
import { parseNextJsConfig } from "./parseNextConfig";
import { functionJson, handler, hostJson, proxiesJson } from "./templates";

export async function build(config: JetztConfig) {
  const {
    sourcePath,
    buildOutputPath,
    buildPagesOutputPath,
    buildAssetsOutputPath
  } = config;

  const nextConfig = await runStep(`Parsing Next.js config...`, () =>
    parseNextJsConfig(sourcePath)
  );

  //
  // Build
  //
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
}

async function buildNextProject(
  sourcePath: string,
  buildPagesOutputPath: string,
  nextConfig: unknown
) {
  await nextBuild(sourcePath, nextConfig);

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
    proxiesJson(config.storageUrl, buildOutput.pages),
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
