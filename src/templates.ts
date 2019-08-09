import { resolve } from "url";
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

function parseParameters(route: string) {
  const parameters: string[] = [];
  const r = /\[(.+?)\]/g;
  let result: RegExpExecArray | null;
  do {
    result = r.exec(route);
    if (result) {
      parameters.push(result[1]);
    }
  } while (result);

  return parameters;
}

export function proxiesJson(assetsUrl: string, pages: NextPage[]): string {
  const pageProxies: any = {};

  // Generate proxies for SSR pages
  for (const p of pages.filter(p => !p.isStatic && !p.isSpecial)) {
    if (p.isDynamicallyRouted) {
      const parameters = parseParameters(p.route);
      pageProxies[`proxy_${p.identifier}`] = {
        matchCondition: {
          methods: ["GET"],
          route: p.route.replace(/\[(.+?)\]/g, "{$1}")
        },
        backendUri: `https://localhost/${p.identifier}?${parameters
          .map(p => `${p}={${p}}`)
          .join("&")}`
      };
    } else {
      pageProxies[`proxy_${p.identifier}`] = {
        matchCondition: {
          methods: ["GET"],
          route: p.route
        },
        backendUri: `https://localhost/${p.identifier}`
      };
    }
  }

  // Generate proxies for static pages
  for (const p of pages.filter(p => p.isStatic && !p.isSpecial)) {
    pageProxies[`proxy_${p.identifier}`] = {
      matchCondition: {
        methods: ["GET"],
        route: p.route
      },
      backendUri: resolve(assetsUrl, `_next/pages/${p.targetPageFileName}`)
    };
  }

  return JSON.stringify({
    proxies: {
      page_assets: {
        matchCondition: {
          methods: ["GET"],
          route: "_next/{*asset}"
        },
        backendUri: `${assetsUrl}_next/{asset}`
      },
      static_assets: {
        matchCondition: {
          methods: ["GET"],
          route: "static/{*asset}"
        },
        backendUri: `${assetsUrl}static/{asset}`
      },
      ...pageProxies
    }
  });
}
