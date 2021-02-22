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
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("tiny-glob");
var log_1 = require("./lib/log");
var path_1 = require("path");
/**
 * Represents a single Next.js page
 *
 */
var NextPage = /** @class */ (function () {
    /**
     *
     * @param path Relative (to .next/serverless/pages) path to page, e.g., `contact/about.tsx`
     * @param sourcePath Absolute path to `.next/serverless/pages` directory
     * @param buildOutputPath Absolute path to place modified pages in
     */
    function NextPage(path, sourcePath, buildOutputPath) {
        this.path = path;
        this.sourcePath = sourcePath;
        this.buildOutputPath = buildOutputPath;
    }
    Object.defineProperty(NextPage.prototype, "isStatic", {
        /**
         * Indicates whether the page was statically pre-rendered
         */
        get: function () {
            return this.path.endsWith(".html");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "isDynamicallyRouted", {
        /**
         * Indicates whether the page uses dynamic routing
         */
        get: function () {
            return /\[(.+)\]/.test(this.route);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "isSpecial", {
        /**
         * Indicates whether the page is a special page, e.g., the error page
         */
        get: function () {
            return this.pageFileName.startsWith("_");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "route", {
        get: function () {
            return this.path
                .split(path_1.sep)
                .slice(1) // Skip `pages`
                .map(function (x) {
                var segment = path_1.basename(x, path_1.extname(x));
                if (segment === "index") {
                    return "";
                }
                return segment;
            })
                .join("/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "processedRoute", {
        get: function () {
            var r = this.route.replace(/\[(.+?)\]/g, "{$1}");
            if (!r) {
                // Workaround for /index route
                return "/";
            }
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "pageName", {
        /**
         * Name of the page
         *
         * For example, for "pages/foo/contact.{ts,js,html}"" this will be "contact". For dynamic pages,
         * [foo] will be replaced with _foo_
         */
        get: function () {
            return path_1.basename(this.path, path_1.extname(this.path)).replace(/\[(.+?)\]/g, "_$1_");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "pageFileName", {
        get: function () {
            return path_1.basename(this.path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "pageSourcePath", {
        get: function () {
            return path_1.join(this.sourcePath, this.path);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "identifier", {
        get: function () {
            // Azure functions don't support sub-folders, so encode folder structure in file name.
            // Skip the first entry (/pages)
            var folder = path_1.dirname(this.path)
                .split(path_1.sep)
                .slice(1)
                .map(function (x) { return x.replace(/\[(.+?)\]/g, "_$1_"); })
                .join("_");
            return "func_" + folder + "_" + this.pageName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "targetFolder", {
        /**
         * Absolute path to the target folder
         */
        get: function () {
            return path_1.join(this.buildOutputPath, this.identifier);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "targetPath", {
        get: function () {
            return path_1.join(this.targetFolder, "__" + this.pageFileName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "targetPageName", {
        get: function () {
            return path_1.basename(this.targetPath, path_1.extname(this.targetPath));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NextPage.prototype, "targetPageFileName", {
        get: function () {
            if (this.isStatic) {
                return this.identifier + ".html";
            }
            return path_1.basename(this.targetPath);
        },
        enumerable: true,
        configurable: true
    });
    NextPage.prototype.toString = function () {
        return this.pageName + " - " + this.isStatic;
    };
    return NextPage;
}());
exports.NextPage = NextPage;
/**
 * Represents the build output for a Next.js project
 */
var NextBuild = /** @class */ (function () {
    function NextBuild(sourcePath) {
        this.sourcePath = sourcePath;
        this._pages = [];
    }
    NextBuild.prototype.init = function (buildOutputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var sourcePath, files, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourcePath = path_1.join(this.sourcePath, ".next", "serverless");
                        return [4 /*yield*/, glob("pages/**/*.{js,html}", {
                                cwd: sourcePath,
                            })];
                    case 1:
                        files = _a.sent();
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            file = files_1[_i];
                            log_1.log("Discovered file " + file, log_1.LogLevel.Debug);
                            this.pages.push(new NextPage(file, sourcePath, buildOutputPath));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(NextBuild.prototype, "pages", {
        get: function () {
            return this._pages;
        },
        enumerable: true,
        configurable: true
    });
    return NextBuild;
}());
exports.NextBuild = NextBuild;
//# sourceMappingURL=next.js.map