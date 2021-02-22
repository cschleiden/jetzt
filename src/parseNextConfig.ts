// Based on
// https://github.com/danielcondemarin/serverless-nextjs-plugin/blob/master/packages/serverless-nextjs-plugin/lib/parseNextConfiguration.js
// by Daniel Condemarin
const nextLoadConfig = require("next/dist/next-server/server/config").default;
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

export function parseNextJsConfig(nextConfigDir: string) {
  const nextConfiguration = nextLoadConfig(
    PHASE_PRODUCTION_BUILD,
    nextConfigDir
  );

  // Force serverless build configuration target
  nextConfiguration.target = "serverless";

  return nextConfiguration;
}
