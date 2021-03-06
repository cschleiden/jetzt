import { promisify } from "util";
import { exec } from "child_process";
import { log, LogLevel } from "./log";

const execAsyncInternal = promisify(exec);

interface ExecError extends Error {
  stdout?: string;
  stderr?: string;
}

let dryRun = false;
export function enableDryRun() {
  dryRun = true;
}

export async function execAsync(cmd: string) {
  if (dryRun) {
    // If dry run is requested, just output the command that would be executed
    log(cmd);
    return undefined;
  } else {
    log(`Executing '${cmd}'...`, LogLevel.Verbose);
    const result = await execAsyncInternal(cmd);

    log(`Output ${result.stdout}`, LogLevel.Debug);

    return result;
  }
}

export function fail(msg: string, error?: ExecError) {
  const errorMessage = error ? `${error.message}` : "";
  log(`${msg} ${errorMessage}`, LogLevel.Error);
  if (error && error.stderr) {
    log(error.stderr, LogLevel.Verbose);
  }
  throw new Error();
}
