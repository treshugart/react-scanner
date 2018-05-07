import { findAllInRenderedTree } from "react-dom/test-utils";
import findRoots from "./find-roots";

let nodes = [];
for (const root of findRoots(document.body)) {
  nodes = nodes.concat(
    findAllInRenderedTree(root.child.child.stateNode, () => true)
  );
}

__exports = nodes;
