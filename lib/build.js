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
// Require next from the folder we're running in
// @ts-ignore
var nextBuild = require.main.require("next/dist/build").default;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = require("path");
var config_1 = require("./config");
var log_1 = require("./log");
var next_1 = require("./next");
var parseNextConfig_1 = require("./parseNextConfig");
var templates_1 = require("./templates");
function build(path) {
    return __awaiter(this, void 0, void 0, function () {
        var nextConfig, config, _a, _b, resolvedPath, buildResult, e_1, buildOutput, _i, _c, page, _d, _e, staticPage;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    nextConfig = parseNextConfig_1.parseNextJsConfig(path);
                    log_1.log("Looking for jetzt configuration...");
                    return [4 /*yield*/, fs_extra_1.default.pathExists("./jetzt.config.json")];
                case 1:
                    if (!(_f.sent())) {
                        throw new Error("Could not find `jetzt.config.json`");
                    }
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_extra_1.default.readFile("./jetzt.config.json", "utf-8")];
                case 2:
                    config = _b.apply(_a, [_f.sent()]);
                    config_1.checkConfig(config);
                    log_1.log("Found configuration.");
                    log_1.log("Building Next.js project...");
                    resolvedPath = path_1.resolve(path);
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, nextBuild(resolvedPath, nextConfig)];
                case 4:
                    buildResult = _f.sent();
                    console.log(JSON.stringify(buildResult, undefined, 2));
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _f.sent();
                    console.error(e_1);
                    return [3 /*break*/, 6];
                case 6:
                    buildOutput = new next_1.NextBuild(resolvedPath);
                    return [4 /*yield*/, buildOutput.init("build")];
                case 7:
                    _f.sent();
                    log_1.log("Done.");
                    log_1.log("Processing pages...");
                    _i = 0, _c = buildOutput.pages.filter(function (p) { return !p.isStatic && !p.isDynamicallyRouted && !p.isSpecial; });
                    _f.label = 8;
                case 8:
                    if (!(_i < _c.length)) return [3 /*break*/, 13];
                    page = _c[_i];
                    log_1.log("Processing " + page.pageName);
                    // Copying to new folder
                    log_1.log("Copying to new file " + page.targetPath, log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.copy(page.pageSourcePath, page.targetPath)];
                case 9:
                    _f.sent();
                    // Wrapping with handler
                    log_1.log("Writing new handler wrapping " + page.targetPageFileName + "...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(page.targetFolder, "index.js"), templates_1.handler(page.targetPageFileName), {
                            encoding: "utf-8"
                        })];
                case 10:
                    _f.sent();
                    // Adding function declaration
                    log_1.log("Writing function description...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(page.targetFolder, "function.json"), templates_1.functionJson(), {
                            encoding: "utf-8"
                        })];
                case 11:
                    _f.sent();
                    _f.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 8];
                case 13:
                    log_1.log("Done.");
                    log_1.log("Generating proxies and host config...");
                    // Generate proxies
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(resolvedPath, "build", "proxies.json"), templates_1.proxiesJson(config.storage.url, buildOutput.pages), {
                            encoding: "utf-8"
                        })];
                case 14:
                    // Generate proxies
                    _f.sent();
                    // Generate host config
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(resolvedPath, "build", "host.json"), templates_1.hostJson(), {
                            encoding: "utf-8"
                        })];
                case 15:
                    // Generate host config
                    _f.sent();
                    log_1.log("Done.");
                    log_1.log("Copying static assets");
                    log_1.log("Copying runtime JS...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.copy(path_1.join(resolvedPath, ".next/static"), path_1.join(resolvedPath, "build", "assets"))];
                case 16:
                    _f.sent();
                    log_1.log("Copying static pages...", log_1.LogLevel.Verbose);
                    _d = 0, _e = buildOutput.pages.filter(function (p) { return p.isStatic; });
                    _f.label = 17;
                case 17:
                    if (!(_d < _e.length)) return [3 /*break*/, 20];
                    staticPage = _e[_d];
                    return [4 /*yield*/, fs_extra_1.default.copy(staticPage.pageSourcePath, path_1.join(resolvedPath, "build", "pages", staticPage.identifier + ".html"))];
                case 18:
                    _f.sent();
                    _f.label = 19;
                case 19:
                    _d++;
                    return [3 /*break*/, 17];
                case 20:
                    log_1.log("Done.");
                    return [2 /*return*/];
            }
        });
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map