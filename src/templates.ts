import { NextPage } from "./next";

export function handler(pageName: string) {
  return `const page = require("./${pageName}");

module.exports = async function (context) {
    await page.render(context.bindings.req, context.res);
};`;
}

export function functionJson() {
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

export function hostJson(): string {
  return JSON.stringify({
    version: "2.0",
    extensions: {
      http: {
        routePrefix: ""
      }
    }
  });
}

export function proxiesJson(assetPath: string, pages: NextPage[]): string {
  const pageProxies: any = {};

  // Generate proxies for normal pages
  for (const p of pages.filter(
    p => !p.isStatic && !p.isDynamicallyRouted && !p.isSpecial
  )) {
    pageProxies[`proxy_${p.identifier}`] = {
      matchCondition: {
        methods: ["GET"],
        route: p.route
      },
      backendUri: `https://localhost/${p.identifier}`
    };
  }

  // Generate proxies for

  return JSON.stringify({
    proxies: {
      static_assets: {
        matchCondition: {
          methods: ["GET"],
          route: "/_next"
        },
        backendUri: assetPath
      },
      ...pageProxies
    }
  });
}