"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Default"] = 0] = "Default";
    LogLevel[LogLevel["Verbose"] = 1] = "Verbose";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.CurrentLogLevel = LogLevel.Debug; // TODO: Set to verbose
function log(text, level) {
    if (level === void 0) { level = LogLevel.Default; }
    if (exports.CurrentLogLevel >= level) {
        if (level === LogLevel.Verbose) {
            console.log(chalk_1.default.gray("[jetzt]\t" + text));
        }
        else {
            console.log("[jetzt]\t" + text);
        }
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map