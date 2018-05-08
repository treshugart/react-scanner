export function isSimple(type) {
  return typeof type === "number" || typeof type === "string";
}

export function getChildrenFromChild(node) {
  const children = [];
  while (node) {
    children.push(node);
    node = node.sibling;
  }
  return children;
}

export function getChildrenFromProps(props) {
  return Array.isArray(props.children) ? props.children : [props.children];
}

export function getChildrenFromNode(node) {
  if (node.child) {
    return getChildrenFromChild(node.child);
  } else if (node.memoizedProps) {
    return getChildrenFromProps(node.memoizedProps);
  } else if (node.props) {
    return getChildrenFromProps(node.props);
  }
  return [];
}

export function getDisplayNameFromNode(node) {
  return node.type
    ? node.type.displayName || node.type.name || node.type
    : null;
}

export function getReactInternalInstance(node) {
  for (const key in node) {
    if (key.indexOf("__reactInternalInstance") === 0) {
      return node[key];
    }
  }
}

export function getReactInternalRoot(node) {
  return (
    node._reactRootContainer && node._reactRootContainer._internalRoot.current
  );
}

export default function json(node) {
  // Return simple data types.
  if (isSimple(node)) {
    return node;
  }

  // Memoized props may also be simple.
  if (isSimple(node.memoizedProps)) {
    return node.memoizedProps;
  }

  // In the last case we generate data for the corresponding React node.
  return {
    children: getChildrenFromNode(node).map(json),
    name: getDisplayNameFromNode(node)
  };
}
