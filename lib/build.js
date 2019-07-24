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
var console_1 = require("console");
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = require("path");
var next_1 = require("./next");
var parseNextConfig_1 = require("./parseNextConfig");
function build(path) {
    return __awaiter(this, void 0, void 0, function () {
        var config, resolvedPath, e_1, buildOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = parseNextConfig_1.parseNextJsConfig(path);
                    console_1.log("Building Next.js project");
                    resolvedPath = path_1.resolve(path);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, nextBuild(resolvedPath, config)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4:
                    buildOutput = new next_1.NextBuild(path_1.join(resolvedPath, ".next"));
                    return [4 /*yield*/, buildOutput.init()];
                case 5:
                    _a.sent();
                    console_1.log("Discovered pages: " + JSON.stringify(buildOutput.pages));
                    // Copy to temporary folder
                    // TODO: Make path configurable
                    return [4 /*yield*/, fs_extra_1.default.copy(path_1.join(resolvedPath, ".next/serverless/pages"), path_1.join(path, "build"))];
                case 6:
                    // Copy to temporary folder
                    // TODO: Make path configurable
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map