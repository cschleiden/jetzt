import chalk from "chalk";

export enum LogLevel {
  Default = 0,
  Verbose = 1,
  Debug = 2,
  Error
}

export let CurrentLogLevel = LogLevel.Debug; // TODO: Set to verbose

export function log(text: string, level = LogLevel.Default): void {
  if (CurrentLogLevel >= level) {
    if (level === LogLevel.Verbose) {
      console.log(chalk.gray(`[jetzt]\t${text}`));
    } else {
      console.log(`[jetzt]\t${text}`);
    }
  }
}
