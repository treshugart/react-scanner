export default function findReactRoots(root) {
  const roots = [];
  const walker = document.createTreeWalker(root);
  while (walker.nextNode()) {
    const container = walker.currentNode._reactRootContainer;
    if (container) {
      roots.push(container._internalRoot.current);
    }
  }
  return roots;
}
