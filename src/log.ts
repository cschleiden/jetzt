import chalk from "chalk";

export enum LogLevel {
  Error = 0,
  Default = 1,
  Verbose = 2,
  Debug = 3
}

export let currentLogLevel = LogLevel.Default;

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

export function log(text: string, level = LogLevel.Default): void {
  if (currentLogLevel >= level) {
    if (level === LogLevel.Verbose) {
      console.log(chalk.gray(`[jetzt]\t${text}`));
    } else {
      console.log(`[jetzt]\t${text}`);
    }
  }
}
