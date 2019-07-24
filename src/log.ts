export enum Level {
  Default = 0,
  Verbose = 1
}

export let LogLevel = Level.Default;

export function log(text: string, level = Level.Default): void {
  if (LogLevel >= level) {
    console.log(text);
  }
}
