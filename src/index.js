#!/usr/bin/env node

const fs = require("fs-extra");
const puppeteer = require("puppeteer");
const reactTreeWalker = require("react-tree-walker");
const { zeropack } = require("zeropack");
const url = "http://ak-mk-2-prod.netlify.com/packages/core/button";

(async function invokePuppeteer() {
  // We generate a bundle that we can inject into the browser. This allows us
  // to use dependencies we otherwise couldn't because all we'd have available
  // is browser globals.
  await zeropack({
    browser: "./dist/index.js",
    externals: [],
    source: "./src/browser.js"
  });
  const script = (await fs.readFile("./dist/index.js")).toString();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  // This injects the bundle script and evaluates it.
  const res = await page.evaluate(script);

  console.log(JSON.stringify(res, null, 2));

  await browser.close();
})();
