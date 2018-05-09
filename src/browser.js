import { json, walk, getDisplayName, findReactInternalRoots } from "./json";

const roots = findReactInternalRoots(document.body);

__exports = roots.map(json);

function computeDimension(a, b) {
  return a < b ? a : b;
}

for (const root of roots) {
  walk(root, node => {
    const displayName = getDisplayName(node);
    if (!displayName) return;
    const displayNameLc = displayName.toLowerCase();
    if (displayNameLc.indexOf("ak") === 0) {
      let parent = node.parent;
      while (parent) {
        const dom = parent.stateNode;
        if (dom && dom.tagName) {
          const label = document.createElement("div");
          const wrapper = document.createElement("div");
          const computedHeight = computeDimension(
            window.innerHeight,
            dom.offsetHeight
          );
          const computedWidth = computeDimension(
            window.innerWidth,
            dom.offsetWidth
          );

          document.body.appendChild(label);
          document.body.appendChild(wrapper);

          label.style.color = "red";
          label.style.fontSize = "20px";
          label.style.left = `${dom.offsetLeft + 3}px`;
          label.style.padding = "5px 10px";
          label.style.position = "absolute";
          label.style.top = `${dom.offsetTop + 3}px`;

          wrapper.style.border = "3px solid red";
          wrapper.style.height = `${computedHeight - 6}px`;
          wrapper.style.left = dom.offsetLeft;
          wrapper.style.position = "absolute";
          wrapper.style.top = dom.offsetTop;
          wrapper.style.width = `${computedWidth - 6}px`;

          label.textContent = displayName;
        }
        parent = parent.parent;
      }
    }
  });
}
