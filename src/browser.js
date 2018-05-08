import roots from "./roots";
import walk from "./w";

__exports = walk(roots(document.body)[0].child.child.stateNode);
