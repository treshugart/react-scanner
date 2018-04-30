#!/usr/bin/env node

const puppeteer = require("puppeteer");
const url = "http://ak-mk-2-prod.netlify.com/";

function evaluate() {
  // ## Utils

  function extractDataFromNode(node) {
    return node.tagName;
  }

  function extractDataFromRoot(node) {
    return node.tagName;
  }

  function getDisplayNameFromNode(node) {
    return node.tagName;
  }

  function getReactInternalInstanceKey(node) {
    for (const key in node) {
      if (key.indexOf("__reactInternalInstance") === 0) {
        return key;
      }
    }
  }

  function findNodes(root, test, func) {
    const nodes = [];
    walk(root, node => {
      const data = test(node);
      if (data) {
        nodes.push(func(node, data));
      }
    });
    return nodes;
  }

  function findReactNodes(root) {
    return findNodes(root, getReactInternalInstanceKey, node => node);
  }

  function findReactRoots(root) {
    return findNodes(root, node => node._reactRootContainer, node => node);
  }

  function findReactRootsAndNodes(root) {
    const roots = [];
    findReactRoots(root).forEach(root =>
      roots.push({
        root: extractDataFromRoot(root),
        nodes: findReactNodes(root).map(extractDataFromNode)
      })
    );
    return roots;
  }

  function walk(root, func) {
    const tree = document.createTreeWalker(root);
    while (tree.nextNode()) {
      func(tree.currentNode);
    }
  }

  // ## Finding

  return findReactRootsAndNodes(document.body);
}

(async function invokePuppeteer() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const res = await page.evaluate(evaluate);

  console.log(res);

  await browser.close();
})();
