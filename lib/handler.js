"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(pageName) {
    return "const page = require(\"./" + pageName + "\");\n\nmodule.exports = async function (context) {\n    await page.render(context.bindings.req, context.res);\n};";
}
exports.handler = handler;
//# sourceMappingURL=handler.js.map