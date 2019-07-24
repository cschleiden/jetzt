"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level;
(function (Level) {
    Level[Level["Default"] = 0] = "Default";
    Level[Level["Verbose"] = 1] = "Verbose";
})(Level = exports.Level || (exports.Level = {}));
exports.LogLevel = Level.Default;
function log(text, level) {
    if (level === void 0) { level = Level.Default; }
    if (exports.LogLevel >= level) {
        console.log(text);
    }
}
exports.log = log;
//# sourceMappingURL=log.js.map