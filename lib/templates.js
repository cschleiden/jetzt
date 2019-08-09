"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
function handler(pageName) {
    return "const page = require(\"./" + pageName + "\");\n\nmodule.exports = async function (context) {\n    await page.render(context.bindings.req, context.res);\n};";
}
exports.handler = handler;
function functionJson() {
    return JSON.stringify({
        bindings: [
            {
                authLevel: "anonymous",
                type: "httpTrigger",
                direction: "in",
                name: "req",
                methods: ["get"]
            },
            {
                type: "http",
                direction: "out",
                name: "res"
            }
        ]
    });
}
exports.functionJson = functionJson;
function hostJson() {
    return JSON.stringify({
        version: "2.0",
        extensions: {
            http: {
                routePrefix: ""
            }
        }
    });
}
exports.hostJson = hostJson;
function parseParameters(route) {
    var parameters = [];
    var r = /\[(.+?)\]/g;
    var result;
    do {
        result = r.exec(route);
        if (result) {
            parameters.push(result[1]);
        }
    } while (result);
    return parameters;
}
function proxiesJson(assetsUrl, pages) {
    var pageProxies = {};
    // Generate proxies for SSR pages
    for (var _i = 0, _a = pages.filter(function (p) { return !p.isStatic && !p.isSpecial; }); _i < _a.length; _i++) {
        var p = _a[_i];
        if (p.isDynamicallyRouted) {
            var parameters = parseParameters(p.route);
            pageProxies["proxy_" + p.identifier] = {
                matchCondition: {
                    methods: ["GET"],
                    route: p.route.replace(/\[(.+?)\]/g, "{$1}")
                },
                backendUri: "https://localhost/" + p.identifier + "?" + parameters
                    .map(function (p) { return p + "={" + p + "}"; })
                    .join("&")
            };
        }
        else {
            pageProxies["proxy_" + p.identifier] = {
                matchCondition: {
                    methods: ["GET"],
                    route: p.route
                },
                backendUri: "https://localhost/" + p.identifier
            };
        }
    }
    // Generate proxies for static pages
    for (var _b = 0, _c = pages.filter(function (p) { return p.isStatic && !p.isSpecial; }); _b < _c.length; _b++) {
        var p = _c[_b];
        pageProxies["proxy_" + p.identifier] = {
            matchCondition: {
                methods: ["GET"],
                route: p.route
            },
            backendUri: url_1.resolve(assetsUrl, "_next/pages/" + p.targetPageFileName)
        };
    }
    return JSON.stringify({
        proxies: __assign({ page_assets: {
                matchCondition: {
                    methods: ["GET"],
                    route: "_next/{*asset}"
                },
                backendUri: assetsUrl + "_next/{asset}"
            }, static_assets: {
                matchCondition: {
                    methods: ["GET"],
                    route: "static/{*asset}"
                },
                backendUri: assetsUrl + "static/{asset}"
            } }, pageProxies)
    });
}
exports.proxiesJson = proxiesJson;
//# sourceMappingURL=templates.js.map