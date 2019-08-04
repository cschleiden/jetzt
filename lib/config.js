"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JetztConfig = /** @class */ (function () {
    function JetztConfig(config) {
        this.config = config;
        this.checkConfig();
    }
    JetztConfig.parse = function (content) {
        var config = JSON.parse(content);
        return new JetztConfig(config);
    };
    Object.defineProperty(JetztConfig.prototype, "name", {
        /**
         * Name of the function app
         */
        get: function () {
            return this.config.functionApp.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "subscriptionId", {
        get: function () {
            return this.config.functionApp.subscriptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "location", {
        get: function () {
            return this.config.functionApp.location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "resourceGroup", {
        get: function () {
            return this.config.functionApp.resourceGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "storageAccount", {
        get: function () {
            return this.config.storage.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "assetsContainerName", {
        get: function () {
            return this.config.functionApp.name + "-assets";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "storageUrl", {
        get: function () {
            return "https://" + this.config.storage.account + ".blob.core.windows.net/" + this.assetsContainerName + "/";
        },
        enumerable: true,
        configurable: true
    });
    JetztConfig.prototype.checkConfig = function () {
        // Storage configuration
        if (!this.config.storage) {
            fail("storage");
        }
        if (!this.config.storage.account) {
            fail("storage/account");
        }
        // Function configuration
        if (!this.config.functionApp) {
            fail("functionApp");
        }
        if (!this.config.functionApp.subscriptionId) {
            fail("functionApp/subscriptionId");
        }
        if (!this.config.functionApp.resourceGroup) {
            fail("functionApp/resourceGroup");
        }
        if (!this.config.functionApp.name) {
            fail("functionApp/name");
        }
        if (!this.config.functionApp.location) {
            fail("functionApp/location");
        }
    };
    return JetztConfig;
}());
exports.JetztConfig = JetztConfig;
function fail(section) {
    throw new Error("Config is missing '" + section + "'");
}
//# sourceMappingURL=config.js.map