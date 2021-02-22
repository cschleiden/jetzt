import { NextPage } from "./next";
import { resolve } from "url";

export function handler(pageName: string) {
  return `const page = require("./${pageName}");

module.exports = async function (context) {
    const req = context.bindings.req;
    if (!req.body) {
      // Always set a body. Azure Functions does some pre-parsing of the body and the provided
      // request doesn't work with Next's usage of stream-utils/raw-body.
      req.body = {};
    }
    await page.default(context.bindings.req, context.res);
};`;
}

export function functionJson(page: NextPage) {
  return JSON.stringify({
    bindings: [
      {
        authLevel: "anonymous",
        type: "httpTrigger",
        direction: "in",
        name: "req",
        methods: ["get"],
        route: page.processedRoute,
      },
      {
        type: "http",
        direction: "out",
        name: "res",
      },
    ],
  });
}

export function hostJson(): string {
  return JSON.stringify({
    version: "2.0",
    extensions: {
      http: {
        routePrefix: "",
      },
    },
  });
}

export function proxiesJson(assetsUrl: string, pages: NextPage[]): string {
  const pageProxies: any = {};

  // Generate proxies for static pages
  for (const p of pages.filter((p) => p.isStatic && !p.isSpecial)) {
    pageProxies[`proxy_${p.identifier}`] = {
      matchCondition: {
        methods: ["GET"],
        route: p.route,
      },
      backendUri: resolve(assetsUrl, `_next/pages/${p.targetPageFileName}`),
    };
  }

  // Add proxies for static assets
  return JSON.stringify({
    proxies: {
      page_assets: {
        matchCondition: {
          methods: ["GET"],
          route: "_next/{*asset}",
        },
        backendUri: `${assetsUrl}_next/{asset}`,
      },
      static_assets: {
        matchCondition: {
          methods: ["GET"],
          route: "static/{*asset}",
        },
        backendUri: `${assetsUrl}static/{asset}`,
      },
      ...pageProxies,
    },
  });
}
