export function handler(pageName: string) {
  return `const page = require("./${pageName}");

module.exports = async function (context) {
    await page.render(context.bindings.req, context.res);
};`;
}

export function functionJson(pageName: string) {
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

export function proxiesJson(): string {
  return JSON.stringify({
    proxies: {
      proxy_contact_form: {
        matchCondition: {
          methods: ["GET"],
          route: "/contact/form"
        },
        backendUri: "https://localhost/func_contact_form"
      }
    }
  });
}
