import { walk, getDisplayName, findReactInternalRoots } from "./json";

__exports = [];

for (const root of findReactInternalRoots(document.body)) {
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

          document.body.appendChild(label);
          document.body.appendChild(wrapper);

          label.style.color = "red";
          label.style.fontSize = "20px";
          label.style.left = `${dom.offsetLeft + 3}px`;
          label.style.padding = "5px 10px";
          label.style.position = "absolute";
          label.style.top = `${dom.offsetTop + 3}px`;

          wrapper.style.border = "3px solid red";
          wrapper.style.height = `${dom.offsetHeight - 6}px`;
          wrapper.style.left = dom.offsetLeft;
          wrapper.style.position = "absolute";
          wrapper.style.top = dom.offsetTop;
          wrapper.style.width = `${dom.offsetWidth - 6}px`;

          label.textContent = displayName;
        }
        parent = parent.parent;
      }
    }
  });
}
