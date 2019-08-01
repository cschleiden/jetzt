#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
import commander = require("commander");
import { build } from "./build";
import { LogLevel, setLogLevel } from "./log";

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
  .description("Test")
  .option(
    "-s, --subscription <subscription>",
    "Id of the Azure subscription to use"
  )
  .option("-v, --verbose", "Output more information")
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

    await build(nextJsFolder);
  })();
}
