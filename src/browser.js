import json, { findReactInternalRoots } from "./json";

__exports = findReactInternalRoots(document.body).map(json);
