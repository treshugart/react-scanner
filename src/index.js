#!/usr/bin/env node

const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const reactTreeWalker = require("react-tree-walker");
const request = require("request");
const { zeropack } = require("zeropack");
const url = "http://ak-mk-2-prod.netlify.com/packages/core/button";

async function compile() {
  // We generate a bundle that we can inject into the browser. This allows us
  // to use dependencies we otherwise couldn't because all we'd have available
  // is browser globals.
  await zeropack({
    browser: "./dist/index.js",
    externals: [],
    source: "./src/browser.js"
  });
  const script = (await fs.readFile("./dist/index.js")).toString();
  return wrapInIife(script);
}

function wrapInIife(script) {
  return new Function(`
    return (async () => {
      let __exports = null;
      ${script}
      return await __exports;
    })();
  `);
}

(async function invokePuppeteer() {
  const browser = await puppeteer.launch({ dumpip: true, headless: true });
  const page = await browser.newPage();

  // await page.setRequestInterception(true);
  // page.on("request", req => {
  //   request(
  //     {
  //       body: req.postData(),
  //       headers: req.headers(),
  //       method: req.method(),
  //       url: req.url()
  //     },
  //     (err, res) => {
  //       req.respond({
  //         body: res.body,
  //         headers: res.headers
  //       });
  //     }
  //   );
  // });

  await page.goto(url);

  const res = await page.evaluate(await compile());

  console.log(JSON.stringify(res, null, 2));

  await browser.close();
})();
