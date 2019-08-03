#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
import commander = require("commander");
import { build } from "./build";
import { LogLevel, setLogLevel } from "./lib/log";
import { enableDryRun } from "./lib/exec";

console.log(
  chalk.green(figlet.textSync("jetzt", { horizontalLayout: "full" }))
);

let nextJsFolder: string | undefined;

const program = new commander.Command();
program
  .version("0.0.1")
  .arguments("<nextjsfolder>")
  .action(folder => {
    nextJsFolder = folder;
  })
  .option("-v, --verbose", "Output more information")
  .option(
    "-d, --dryrun",
    "Don't actually deploy to Azure, just output cli commands that would run"
  )
  // TODO implement
  //.option("-f, --force", "Force re-creating the function app")
  .parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length || !nextJsFolder) {
  program.outputHelp();
  process.exitCode = 1;
} else {
  // Logic
  (async function() {
    if (program.verbose) {
      setLogLevel(LogLevel.Verbose);
    }

    if (program.dryrun) {
      enableDryRun();
    }

    try {
      await build(nextJsFolder);
    } catch (e) {
      console.log(chalk.red(`Error: ${e.message}`));
      process.exitCode = 1;
    }
  })();
}
