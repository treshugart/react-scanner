#!/usr/bin/env node

const crawler = require("headless-chrome-crawler");
const fs = require("fs-extra");
const reactTreeWalker = require("react-tree-walker");
const request = require("request");
const { zeropack } = require("zeropack");

const url = "http://ak-mk-2-prod.netlify.com/";
const viewport = { height: 1080, width: 1920 };

function slugify(str) {
  return str.replace(/\W+/g, "-");
}

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

function getScreenshotUrl(str) {
  return `./screenshots/${slugify(str)}.png`;
}

function getQueueOptions(str) {
  return {
    screenshot: { path: getScreenshotUrl(str) },
    url: str,
    viewport
  };
}

(async function run() {
  // Cleanup.
  await fs.remove("./screenshots");
  await fs.mkdir("./screenshots");

  let crawled = [];

  const browser = await crawler.launch({
    evaluatePage: await compile(),
    async onSuccess(res) {
      console.log(res.options.url);
      const nextQueue = res.links
        .filter(
          l =>
            l.indexOf(url) === 0 &&
            crawled.indexOf(l) === -1 &&
            l !== res.options.url
        )
        .map(getQueueOptions);
      crawled = crawled.concat(res.links);
      return await browser.queue(nextQueue);
    }
  });
  await browser.queue(getQueueOptions(url));
  await browser.onIdle();
  await browser.close();
})();
