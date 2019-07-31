"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Based on
// https://github.com/danielcondemarin/serverless-nextjs-plugin/blob/master/packages/serverless-nextjs-plugin/lib/parseNextConfiguration.js
// by Daniel Condemarin
var nextLoadConfig = require("next-server/dist/server/config").default;
var PHASE_PRODUCTION_BUILD = require("next-server/dist/lib/constants").PHASE_PRODUCTION_BUILD;
function parseNextJsConfig(nextConfigDir) {
    var nextConfiguration = nextLoadConfig(PHASE_PRODUCTION_BUILD, nextConfigDir);
    // Force serverless build configuration target
    nextConfiguration.target = "serverless";
    return nextConfiguration;
}
exports.parseNextJsConfig = parseNextJsConfig;
//# sourceMappingURL=parseNextConfig.js.map