#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
import path = require("path");
import commander = require("commander");
import { build } from "./build";

console.log(
  chalk.green(figlet.textSync("jetzt", { horizontalLayout: "full" }))
);

let nextJsFolder: string | undefined;

const program = new commander.Command();
program
  .version("0.0.1", "-v, --version")
  .arguments("<nextjsfolder>")
  .action(folder => {
    nextJsFolder = folder;
  })
  .description("Test")
  .option(
    "-s, --subscription <subscription>",
    "Id of the Azure subscription to use"
  )
  .parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length || !nextJsFolder) {
  program.outputHelp();
  process.exitCode = 1;
} else {
  // Logic
  (async function() {
    await build(nextJsFolder);
  })();
}
