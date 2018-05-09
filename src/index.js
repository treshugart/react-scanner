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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const res = await page.evaluate(await compile());

  await page.screenshot({ path: "./screnshot.png" });
  await browser.close();
})();
