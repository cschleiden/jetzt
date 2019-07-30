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
        authLevel: "function",
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
