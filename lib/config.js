"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkConfig(config) {
    // Storage configuration
    if (!config.storage) {
        fail("storage");
    }
    if (!config.storage.account) {
        fail("storage/account");
    }
    if (!config.storage.container) {
        fail("storage/container");
    }
    if (!config.storage.url) {
        fail("storage/url");
    }
    // Function configuration
    if (!config.functionApp) {
        fail("functionApp");
    }
}
exports.checkConfig = checkConfig;
function fail(section) {
    throw new Error("Config is missing '" + section + "'");
}
//# sourceMappingURL=config.js.map