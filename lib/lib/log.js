"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Default"] = 1] = "Default";
    LogLevel[LogLevel["Verbose"] = 2] = "Verbose";
    LogLevel[LogLevel["Debug"] = 3] = "Debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.currentLogLevel = LogLevel.Default;
function setLogLevel(level) {
    exports.currentLogLevel = level;
}
exports.setLogLevel = setLogLevel;
function log(text, level) {
    if (level === void 0) { level = LogLevel.Default; }
    if (exports.currentLogLevel >= level) {
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