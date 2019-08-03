import { log, LogLevel } from "./log";

export async function runStep<T>(
  description: string,
  step: () => Promise<T>
): Promise<T> {
  log(description);
  const result = await step();
  log(`Done.`, LogLevel.Verbose);

  return result;
}
