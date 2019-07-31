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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require next from the folder we're running in
// @ts-ignore
var nextBuild = require.main.require("next/dist/build").default;
var archiver = require("archiver");
var fs_extra_1 = __importStar(require("fs-extra"));
var path_1 = require("path");
var config_1 = require("./config");
var log_1 = require("./log");
var next_1 = require("./next");
var parseNextConfig_1 = require("./parseNextConfig");
var templates_1 = require("./templates");
function build(path) {
    return __awaiter(this, void 0, void 0, function () {
        var sourcePath, buildOutputPath, buildPagesOutputPath, buildAssetsOutputPath, nextConfig, config, buildResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourcePath = path_1.resolve(path);
                    buildOutputPath = path_1.join(sourcePath, "build");
                    buildPagesOutputPath = path_1.join(buildOutputPath, "pages");
                    buildAssetsOutputPath = path_1.join(buildOutputPath, "assets");
                    return [4 /*yield*/, runStep("Parsing Next.js config...", function () {
                            return parseNextConfig_1.parseNextJsConfig(path);
                        })];
                case 1:
                    nextConfig = _a.sent();
                    return [4 /*yield*/, runStep("Looking for jetzt configuration...", function () {
                            return getJetztConfig();
                        })];
                case 2:
                    config = _a.sent();
                    return [4 /*yield*/, runStep("Building Next.js project...", function () {
                            return buildNextProject(sourcePath, buildPagesOutputPath, nextConfig);
                        })];
                case 3:
                    buildResult = _a.sent();
                    // Process build result
                    return [4 /*yield*/, runStep("Processing SSR pages...", function () { return processSSRPages(buildResult); })];
                case 4:
                    // Process build result
                    _a.sent();
                    return [4 /*yield*/, runStep("Generating proxy configuration...", function () {
                            return generateProxies(buildResult, buildPagesOutputPath, config);
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, runStep("Generating host configuration...", function () {
                            return generateHostConfig(buildPagesOutputPath);
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, runStep("Copying static assets", function () {
                            return copyStaticAssets(sourcePath, buildAssetsOutputPath, buildResult);
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, runStep("Building Azure functions package", function () {
                            return createPackage(buildPagesOutputPath, buildOutputPath);
                        })];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.build = build;
function runStep(description, step) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.log(description);
                    return [4 /*yield*/, step()];
                case 1:
                    result = _a.sent();
                    log_1.log("Done.", log_1.LogLevel.Verbose);
                    return [2 /*return*/, result];
            }
        });
    });
}
function getJetztConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var config, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fs_extra_1.default.pathExists("./jetzt.config.json")];
                case 1:
                    if (!(_c.sent())) {
                        throw new Error("Could not find `jetzt.config.json`");
                    }
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_extra_1.default.readFile("./jetzt.config.json", "utf-8")];
                case 2:
                    config = _b.apply(_a, [_c.sent()]);
                    config_1.checkConfig(config);
                    return [2 /*return*/, config];
            }
        });
    });
}
function buildNextProject(sourcePath, buildPagesOutputPath, nextConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var buildResult, e_1, buildOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, nextBuild(sourcePath, nextConfig)];
                case 1:
                    buildResult = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    throw e_1;
                case 3:
                    buildOutput = new next_1.NextBuild(sourcePath);
                    return [4 /*yield*/, buildOutput.init(buildPagesOutputPath)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, buildOutput];
            }
        });
    });
}
function processSSRPages(buildResult) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, page;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = buildResult.pages.filter(function (p) { return !p.isStatic && !p.isDynamicallyRouted && !p.isSpecial; });
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    page = _a[_i];
                    log_1.log("Processing " + page.pageName);
                    // Copying to new folder
                    log_1.log("Copying to new file " + page.targetPath, log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.copy(page.pageSourcePath, page.targetPath)];
                case 2:
                    _b.sent();
                    // Wrapping with handler
                    log_1.log("Writing new handler wrapping " + page.targetPageFileName + "...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(page.targetFolder, "index.js"), templates_1.handler(page.targetPageFileName), {
                            encoding: "utf-8"
                        })];
                case 3:
                    _b.sent();
                    // Adding function declaration
                    log_1.log("Writing function description...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(page.targetFolder, "function.json"), templates_1.functionJson(), {
                            encoding: "utf-8"
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function generateProxies(buildOutput, buildPagesOutputPath, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Generate proxies
                return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(buildPagesOutputPath, "proxies.json"), templates_1.proxiesJson(config.storage.url, buildOutput.pages), {
                        encoding: "utf-8"
                    })];
                case 1:
                    // Generate proxies
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generateHostConfig(buildPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Generate host config
                return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(buildPath, "host.json"), templates_1.hostJson(), {
                        encoding: "utf-8"
                    })];
                case 1:
                    // Generate host config
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function copyStaticAssets(sourcePath, buildAssetOutputPath, buildResult) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, staticPage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log_1.log("Copying runtime JS...", log_1.LogLevel.Verbose);
                    return [4 /*yield*/, fs_extra_1.default.copy(path_1.join(sourcePath, ".next/static"), buildAssetOutputPath)];
                case 1:
                    _b.sent();
                    log_1.log("Copying static pages...", log_1.LogLevel.Verbose);
                    _i = 0, _a = buildResult.pages.filter(function (p) { return p.isStatic; });
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    staticPage = _a[_i];
                    return [4 /*yield*/, fs_extra_1.default.copy(staticPage.pageSourcePath, path_1.join(sourcePath, "build", "pages", staticPage.identifier + ".html"))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createPackage(sourcePath, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var packageFilename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageFilename = "package.zip";
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var output = fs_extra_1.createWriteStream(path_1.join(outputPath, packageFilename));
                            output.on("finish", resolve);
                            output.on("error", reject);
                            var archive = archiver("zip", {
                                zlib: { level: 0 }
                            });
                            archive
                                .glob("**/*", {
                                ignore: packageFilename,
                                cwd: sourcePath
                            })
                                .on("error", reject)
                                .pipe(output);
                            archive.finalize();
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.join(outputPath, "packagename.txt"), packageFilename, {
                            encoding: "utf-8"
                        })];
                case 2:
                    _a.sent();
                    // Clean up directories
                    return [4 /*yield*/, fs_extra_1.default.remove(sourcePath)];
                case 3:
                    // Clean up directories
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=build.js.map