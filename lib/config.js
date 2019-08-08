"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = require("path");
var configPrompt_1 = require("./config/configPrompt");
var log_1 = require("./lib/log");
function getJetztConfig(path) {
    return __awaiter(this, void 0, void 0, function () {
        var sourcePath, config, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sourcePath = path_1.resolve(path);
                    return [4 /*yield*/, fs_extra_1.default.pathExists(path_1.join(sourcePath, "jetzt.config.json"))];
                case 1:
                    if (!!(_d.sent())) return [3 /*break*/, 3];
                    log_1.log("Could not find configuration.");
                    debugger;
                    return [4 /*yield*/, configPrompt_1.configPrompt(sourcePath)];
                case 2:
                    config = _d.sent();
                    if (!config) {
                        // Prompt was aborted, throw error.
                        throw new Error("Could not find `jetzt.config.json`");
                    }
                    return [2 /*return*/, config];
                case 3:
                    _b = (_a = JetztConfig).parse;
                    _c = [sourcePath];
                    return [4 /*yield*/, fs_extra_1.default.readFile(path_1.join(sourcePath, "jetzt.config.json"), "utf-8")];
                case 4: return [2 /*return*/, _b.apply(_a, _c.concat([_d.sent()]))];
            }
        });
    });
}
exports.getJetztConfig = getJetztConfig;
var JetztConfig = /** @class */ (function () {
    function JetztConfig(sourcePath, config) {
        this.sourcePath = sourcePath;
        this.config = config;
        this.checkConfig();
    }
    JetztConfig.parse = function (sourcePath, content) {
        var config = JSON.parse(content);
        return new JetztConfig(sourcePath, config);
    };
    JetztConfig.write = function (sourcePath, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(sourcePath, "jetzt.config.json"), JSON.stringify(config, undefined, 2))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(JetztConfig.prototype, "buildOutputPath", {
        get: function () {
            return path_1.join(this.sourcePath, "build");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "buildPagesOutputPath", {
        get: function () {
            return path_1.join(this.buildOutputPath, "pages");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JetztConfig.prototype, "buildAssetsOutputPath", {
        get: function () {
            return path_1.join(this.buildOutputPath, "assets");
        },
        enumerable: true,
        configurable: true
    });
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