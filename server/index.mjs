import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { sharedConfig, lazy, createComponent, createUniqueId, useContext, createRenderEffect, onCleanup, createContext as createContext$1, createSignal, createMemo, untrack, on as on$1, runWithOwner, getOwner, startTransition, resetErrorBoundaries, batch, mergeProps as mergeProps$1, splitProps, catchError, ErrorBoundary, onMount, Suspense, Show, For, children, createRoot } from 'solid-js';
import { renderToString, isServer, getRequestEvent, ssrElement, escape, mergeProps, ssr, createComponent as createComponent$1, useAssets, spread, renderToStream, ssrHydrationKey, NoHydration, Hydration, ssrAttribute, HydrationScript, delegateEvents } from 'solid-js/web';
import { provideRequestEvent } from 'solid-js/web/storage';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o$1(n){throw new Error(`${n} is not implemented yet!`)}let i$2 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o$1("Readable.asyncIterator")}iterator(e){throw o$1("Readable.iterator")}map(e,t){throw o$1("Readable.map")}filter(e,t){throw o$1("Readable.filter")}forEach(e,t){throw o$1("Readable.forEach")}reduce(e,t,r){throw o$1("Readable.reduce")}find(e,t){throw o$1("Readable.find")}findIndex(e,t){throw o$1("Readable.findIndex")}some(e,t){throw o$1("Readable.some")}toArray(e){throw o$1("Readable.toArray")}every(e,t){throw o$1("Readable.every")}flatMap(e,t){throw o$1("Readable.flatMap")}drop(e,t){throw o$1("Readable.drop")}take(e,t){throw o$1("Readable.take")}asIndexedPairs(e){throw o$1("Readable.asIndexedPairs")}};let l$2 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$2,t=new l$2){Object.assign(this,e),Object.assign(this,t),this._destroy=m$3(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$1.prototype,i$2.prototype),Object.assign(c$1.prototype,l$2.prototype),c$1}function m$3(...n){return function(...e){for(const t of n)t(...e);}}const g$3=_$1();let A$2 = class A extends g$3{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$4 = class y extends i$2{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p$2(this.headers)}get trailersDistinct(){return p$2(this.trailers)}};function p$2(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$2{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$2=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E$2,t=Array.isArray(n)||H$3(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$3(n){return typeof n?.entries=="function"}function v$2(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$4=new Set([101,204,205,304]);async function b$2(n,e){const t=new y$4,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$4.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$3(n,e,t={}){try{const r=await b$2(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v$2(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function getRequestIP(event, opts = {}) {
  if (event.context.clientAddress) {
    return event.context.clientAddress;
  }
  if (opts.xForwardedFor) {
    const xForwardedFor = getRequestHeader(event, "x-forwarded-for")?.split(",").shift()?.trim();
    if (xForwardedFor) {
      return xForwardedFor;
    }
  }
  if (event.node.req.socket.remoteAddress) {
    return event.node.req.socket.remoteAddress;
  }
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

const _globalThis$1 = (function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
})();
const fetch$1 = _globalThis$1.fetch ? (...args) => _globalThis$1.fetch(...args) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
const Headers$1 = _globalThis$1.Headers;
const AbortController$1 = _globalThis$1.AbortController;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s$1="base64url";function digest(t){if(e)return e(r,t,s$1);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s$1):o.digest(s$1)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {
      "/_build/assets/**": {
        "headers": {
          "cache-control": "public, immutable, max-age=31536000"
        }
      }
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","base":"/","dir":"./public","root":"/Users/hector/Documents/marquet","order":0,"outDir":"/Users/hector/Documents/marquet/.vinxi/build/public"},{"name":"ssr","type":"http","link":{"client":"client"},"handler":"src/entry-server.tsx","extensions":["js","jsx","ts","tsx"],"target":"server","root":"/Users/hector/Documents/marquet","base":"/","outDir":"/Users/hector/Documents/marquet/.vinxi/build/ssr","order":1},{"name":"client","type":"client","base":"/_build","handler":"src/entry-client.tsx","extensions":["js","jsx","ts","tsx"],"target":"browser","root":"/Users/hector/Documents/marquet","outDir":"/Users/hector/Documents/marquet/.vinxi/build/client","order":2},{"name":"server-fns","type":"http","base":"/_server","handler":"node_modules/.pnpm/@solidjs+start@1.3.2_solid-js@1.9.13_vinxi@0.5.11_db0@0.3.4_ioredis@5.11.1_jiti@2.7.0_l_04989c4ef4112cb983e1cfd0d3e23e6c/node_modules/@solidjs/start/dist/runtime/server-handler.js","target":"server","root":"/Users/hector/Documents/marquet","outDir":"/Users/hector/Documents/marquet/.vinxi/build/server-fns","order":3}],"server":{"compressPublicAssets":{"brotli":true},"routeRules":{"/_build/assets/**":{"headers":{"cache-control":"public, immutable, max-age=31536000"}}},"experimental":{"asyncContext":true},"preset":"bun"},"root":"/Users/hector/Documents/marquet"};
					const buildManifest = {"ssr":{"_Money-BFVoQFsZ.js":{"file":"assets/Money-BFVoQFsZ.js","name":"Money"},"_ProductImage-Cc-vAvYz.js":{"file":"assets/ProductImage-Cc-vAvYz.js","name":"ProductImage","imports":["_i18n-DVsVPu0K.js"]},"_PromoBanner-IjyG3wIB.js":{"file":"assets/PromoBanner-IjyG3wIB.js","name":"PromoBanner","imports":["_cart-BmnZ5whE.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js","_api-BUYYQCvG.js"]},"_RequireAuth-CvRtqHzQ.js":{"file":"assets/RequireAuth-CvRtqHzQ.js","name":"RequireAuth","imports":["_i18n-DVsVPu0K.js"]},"_api-BUYYQCvG.js":{"file":"assets/api-BUYYQCvG.js","name":"api","imports":["_i18n-DVsVPu0K.js"]},"_cart-BmnZ5whE.js":{"file":"assets/cart-BmnZ5whE.js","name":"cart","imports":["_api-BUYYQCvG.js"]},"_combos-Dyt9v_Yz.js":{"file":"assets/combos-Dyt9v_Yz.js","name":"combos"},"_i18n-DVsVPu0K.js":{"file":"assets/i18n-DVsVPu0K.js","name":"i18n"},"_index-BSDoL9aR.js":{"file":"assets/index-BSDoL9aR.js","name":"index"},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"cart.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_cart-BmnZ5whE.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js","_api-BUYYQCvG.js"]},"src/routes/checkout.tsx?pick=default&pick=$css":{"file":"checkout.js","name":"checkout","src":"src/routes/checkout.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_cart-BmnZ5whE.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_i18n-DVsVPu0K.js","_PromoBanner-IjyG3wIB.js","_cart-BmnZ5whE.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js"]},"src/routes/login.tsx?pick=default&pick=$css":{"file":"login.js","name":"login","src":"src/routes/login.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_i18n-DVsVPu0K.js"]},"src/routes/ofertas/[combo].tsx?pick=default&pick=$css":{"file":"_combo_.js","name":"_combo_","src":"src/routes/ofertas/[combo].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_cart-BmnZ5whE.js","_combos-Dyt9v_Yz.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js"]},"src/routes/ofertas/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/ofertas/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_combos-Dyt9v_Yz.js","_i18n-DVsVPu0K.js","_PromoBanner-IjyG3wIB.js","_cart-BmnZ5whE.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js"]},"src/routes/orders/[id].tsx?pick=default&pick=$css":{"file":"_id_.js","name":"_id_","src":"src/routes/orders/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_api-BUYYQCvG.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_RequireAuth-CvRtqHzQ.js"]},"src/routes/orders/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/orders/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_RequireAuth-CvRtqHzQ.js"]},"src/routes/product/[id].tsx?pick=default&pick=$css":{"file":"_id_2.js","name":"_id_","src":"src/routes/product/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-BUYYQCvG.js","_cart-BmnZ5whE.js","_i18n-DVsVPu0K.js","_Money-BFVoQFsZ.js","_ProductImage-Cc-vAvYz.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_index-BSDoL9aR.js","_i18n-DVsVPu0K.js","_cart-BmnZ5whE.js","_api-BUYYQCvG.js"],"dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/cart.tsx?pick=default&pick=$css","src/routes/checkout.tsx?pick=default&pick=$css","src/routes/checkout.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/login.tsx?pick=default&pick=$css","src/routes/login.tsx?pick=default&pick=$css","src/routes/ofertas/[combo].tsx?pick=default&pick=$css","src/routes/ofertas/[combo].tsx?pick=default&pick=$css","src/routes/ofertas/index.tsx?pick=default&pick=$css","src/routes/ofertas/index.tsx?pick=default&pick=$css","src/routes/orders/[id].tsx?pick=default&pick=$css","src/routes/orders/[id].tsx?pick=default&pick=$css","src/routes/orders/index.tsx?pick=default&pick=$css","src/routes/orders/index.tsx?pick=default&pick=$css","src/routes/product/[id].tsx?pick=default&pick=$css","src/routes/product/[id].tsx?pick=default&pick=$css"],"css":["assets/ssr-BOCq2485.css"]}},"client":{"_Money-BFVoQFsZ.js":{"file":"assets/Money-BFVoQFsZ.js","name":"Money"},"_ProductImage-BBA3ePvh.js":{"file":"assets/ProductImage-BBA3ePvh.js","name":"ProductImage","imports":["_i18n-DhC8pOTw.js"]},"_PromoBanner-DfxIk5oi.js":{"file":"assets/PromoBanner-DfxIk5oi.js","name":"PromoBanner","imports":["_i18n-DhC8pOTw.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js","_api-id5mx5ww.js"]},"_RequireAuth-1rBPcrp7.js":{"file":"assets/RequireAuth-1rBPcrp7.js","name":"RequireAuth","imports":["_i18n-DhC8pOTw.js"]},"_api-id5mx5ww.js":{"file":"assets/api-id5mx5ww.js","name":"api","imports":["_i18n-DhC8pOTw.js"]},"_cart-Cot-aues.js":{"file":"assets/cart-Cot-aues.js","name":"cart","imports":["_i18n-DhC8pOTw.js","_api-id5mx5ww.js"]},"_combos-Dyt9v_Yz.js":{"file":"assets/combos-Dyt9v_Yz.js","name":"combos"},"_i18n-DhC8pOTw.js":{"file":"assets/i18n-DhC8pOTw.js","name":"i18n"},"_index-ogCbY43q.js":{"file":"assets/index-ogCbY43q.js","name":"index","imports":["_i18n-DhC8pOTw.js"]},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"assets/cart-DJPzsvJb.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js","_api-id5mx5ww.js"]},"src/routes/checkout.tsx?pick=default&pick=$css":{"file":"assets/checkout-BYgTbCLE.js","name":"checkout","src":"src/routes/checkout.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"assets/index-kPpelr90.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_PromoBanner-DfxIk5oi.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js"]},"src/routes/login.tsx?pick=default&pick=$css":{"file":"assets/login-C9VI-_Mt.js","name":"login","src":"src/routes/login.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js"]},"src/routes/ofertas/[combo].tsx?pick=default&pick=$css":{"file":"assets/_combo_-BnaxPXPk.js","name":"_combo_","src":"src/routes/ofertas/[combo].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_cart-Cot-aues.js","_combos-Dyt9v_Yz.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js"]},"src/routes/ofertas/index.tsx?pick=default&pick=$css":{"file":"assets/index-CYwdsy7E.js","name":"index","src":"src/routes/ofertas/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_combos-Dyt9v_Yz.js","_PromoBanner-DfxIk5oi.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js"]},"src/routes/orders/[id].tsx?pick=default&pick=$css":{"file":"assets/_id_-D5Of7Oc1.js","name":"_id_","src":"src/routes/orders/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_api-id5mx5ww.js","_Money-BFVoQFsZ.js","_RequireAuth-1rBPcrp7.js"]},"src/routes/orders/index.tsx?pick=default&pick=$css":{"file":"assets/index-spayGTqs.js","name":"index","src":"src/routes/orders/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_Money-BFVoQFsZ.js","_RequireAuth-1rBPcrp7.js"]},"src/routes/product/[id].tsx?pick=default&pick=$css":{"file":"assets/_id_-DuMLBRSU.js","name":"_id_","src":"src/routes/product/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_api-id5mx5ww.js","_cart-Cot-aues.js","_Money-BFVoQFsZ.js","_ProductImage-BBA3ePvh.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-DnCDWI_f.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_i18n-DhC8pOTw.js","_index-ogCbY43q.js","_cart-Cot-aues.js","_api-id5mx5ww.js"],"dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/checkout.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/login.tsx?pick=default&pick=$css","src/routes/ofertas/[combo].tsx?pick=default&pick=$css","src/routes/ofertas/index.tsx?pick=default&pick=$css","src/routes/orders/[id].tsx?pick=default&pick=$css","src/routes/orders/index.tsx?pick=default&pick=$css","src/routes/product/[id].tsx?pick=default&pick=$css"],"css":["assets/client-BOCq2485.css"]}},"server-fns":{"_Money-BFVoQFsZ.js":{"file":"assets/Money-BFVoQFsZ.js","name":"Money"},"_ProductImage-DE0iff3I.js":{"file":"assets/ProductImage-DE0iff3I.js","name":"ProductImage","imports":["_i18n-BOvpsPhe.js"]},"_PromoBanner-DmyIY7Mi.js":{"file":"assets/PromoBanner-DmyIY7Mi.js","name":"PromoBanner","imports":["_cart-Bgs-B906.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js","_api-CoAX2wNl.js"]},"_RequireAuth-DAHEMjcW.js":{"file":"assets/RequireAuth-DAHEMjcW.js","name":"RequireAuth","imports":["_i18n-BOvpsPhe.js"]},"_api-CoAX2wNl.js":{"file":"assets/api-CoAX2wNl.js","name":"api","imports":["_i18n-BOvpsPhe.js"]},"_cart-Bgs-B906.js":{"file":"assets/cart-Bgs-B906.js","name":"cart","imports":["_api-CoAX2wNl.js"]},"_combos-Dyt9v_Yz.js":{"file":"assets/combos-Dyt9v_Yz.js","name":"combos"},"_i18n-BOvpsPhe.js":{"file":"assets/i18n-BOvpsPhe.js","name":"i18n"},"_index-BSDoL9aR.js":{"file":"assets/index-BSDoL9aR.js","name":"index"},"_server-fns-B2RniMQR.js":{"file":"assets/server-fns-B2RniMQR.js","name":"server-fns","dynamicImports":["src/routes/cart.tsx?pick=default&pick=$css","src/routes/cart.tsx?pick=default&pick=$css","src/routes/checkout.tsx?pick=default&pick=$css","src/routes/checkout.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/index.tsx?pick=default&pick=$css","src/routes/login.tsx?pick=default&pick=$css","src/routes/login.tsx?pick=default&pick=$css","src/routes/ofertas/[combo].tsx?pick=default&pick=$css","src/routes/ofertas/[combo].tsx?pick=default&pick=$css","src/routes/ofertas/index.tsx?pick=default&pick=$css","src/routes/ofertas/index.tsx?pick=default&pick=$css","src/routes/orders/[id].tsx?pick=default&pick=$css","src/routes/orders/[id].tsx?pick=default&pick=$css","src/routes/orders/index.tsx?pick=default&pick=$css","src/routes/orders/index.tsx?pick=default&pick=$css","src/routes/product/[id].tsx?pick=default&pick=$css","src/routes/product/[id].tsx?pick=default&pick=$css","src/app.tsx"]},"src/app.tsx":{"file":"assets/app-jW7-0Y0D.js","name":"app","src":"src/app.tsx","isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_server-fns-B2RniMQR.js","_i18n-BOvpsPhe.js","_cart-Bgs-B906.js","_api-CoAX2wNl.js"],"css":["assets/app-BOCq2485.css"]},"src/routes/cart.tsx?pick=default&pick=$css":{"file":"cart.js","name":"cart","src":"src/routes/cart.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_cart-Bgs-B906.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js","_api-CoAX2wNl.js"]},"src/routes/checkout.tsx?pick=default&pick=$css":{"file":"checkout.js","name":"checkout","src":"src/routes/checkout.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_cart-Bgs-B906.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js"]},"src/routes/index.tsx?pick=default&pick=$css":{"file":"index.js","name":"index","src":"src/routes/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_i18n-BOvpsPhe.js","_PromoBanner-DmyIY7Mi.js","_cart-Bgs-B906.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js"]},"src/routes/login.tsx?pick=default&pick=$css":{"file":"login.js","name":"login","src":"src/routes/login.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_i18n-BOvpsPhe.js"]},"src/routes/ofertas/[combo].tsx?pick=default&pick=$css":{"file":"_combo_.js","name":"_combo_","src":"src/routes/ofertas/[combo].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_cart-Bgs-B906.js","_combos-Dyt9v_Yz.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js"]},"src/routes/ofertas/index.tsx?pick=default&pick=$css":{"file":"index2.js","name":"index","src":"src/routes/ofertas/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_combos-Dyt9v_Yz.js","_i18n-BOvpsPhe.js","_PromoBanner-DmyIY7Mi.js","_cart-Bgs-B906.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js"]},"src/routes/orders/[id].tsx?pick=default&pick=$css":{"file":"_id_.js","name":"_id_","src":"src/routes/orders/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_api-CoAX2wNl.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_RequireAuth-DAHEMjcW.js"]},"src/routes/orders/index.tsx?pick=default&pick=$css":{"file":"index3.js","name":"index","src":"src/routes/orders/index.tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_RequireAuth-DAHEMjcW.js"]},"src/routes/product/[id].tsx?pick=default&pick=$css":{"file":"_id_2.js","name":"_id_","src":"src/routes/product/[id].tsx?pick=default&pick=$css","isEntry":true,"isDynamicEntry":true,"imports":["_index-BSDoL9aR.js","_api-CoAX2wNl.js","_cart-Bgs-B906.js","_i18n-BOvpsPhe.js","_Money-BFVoQFsZ.js","_ProductImage-DE0iff3I.js"]},"virtual:$vinxi/handler/server-fns":{"file":"server-fns.js","name":"server-fns","src":"virtual:$vinxi/handler/server-fns","isEntry":true,"imports":["_server-fns-B2RniMQR.js"]}}};

					const routeManifest = {"ssr":{},"client":{},"server-fns":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const assets = {
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"80-NsJCq7Utd6dqqhWIzRn0shwqZuE\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 128,
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": "\"170-g1RpQimY/g4z5GbBt+y/5I6BwyY\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 368,
    "path": "../public/sitemap.xml"
  },
  "/assets/ssr-BOCq2485.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"8aee-E1ELLCR7P15+/bZUlCmHtJL29Fc\"",
    "mtime": "2026-07-17T01:01:13.861Z",
    "size": 35566,
    "path": "../public/assets/ssr-BOCq2485.css"
  },
  "/assets/ssr-BOCq2485.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"15e5-uM0TsLk6KgA+cMRC39+p4v+UVAQ\"",
    "mtime": "2026-07-17T01:01:13.904Z",
    "size": 5605,
    "path": "../public/assets/ssr-BOCq2485.css.br"
  },
  "/assets/ssr-BOCq2485.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1965-NaBEuhuPvUvv3x6WNjn10ViSZNE\"",
    "mtime": "2026-07-17T01:01:13.873Z",
    "size": 6501,
    "path": "../public/assets/ssr-BOCq2485.css.gz"
  },
  "/img/combo-limpieza.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ef7e-MO9mjl3xpnQ1mZI7FYF1YpHCnWY\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 126846,
    "path": "../public/img/combo-limpieza.jpg"
  },
  "/img/combo-bebidas.jpg": {
    "type": "image/jpeg",
    "etag": "\"207d7-OF73YwM/VOA1FCojtKDa3Iquf1M\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 133079,
    "path": "../public/img/combo-bebidas.jpg"
  },
  "/_build/.vite/manifest.json.br": {
    "type": "application/json",
    "encoding": "br",
    "etag": "\"2bc-GmbR/qV3gE45n6hWG1VGM7EofJM\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 700,
    "path": "../public/_build/.vite/manifest.json.br"
  },
  "/img/combo-despensa.jpg": {
    "type": "image/jpeg",
    "etag": "\"22cdd-kYC4RQZxWIfI3aZxXjNjG2m/rgQ\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 142557,
    "path": "../public/img/combo-despensa.jpg"
  },
  "/_build/.vite/manifest.json.gz": {
    "type": "application/json",
    "encoding": "gzip",
    "etag": "\"30e-ik1kf5G6wbJaYlVS1Zxlxsmxj9c\"",
    "mtime": "2026-07-17T01:01:13.873Z",
    "size": 782,
    "path": "../public/_build/.vite/manifest.json.gz"
  },
  "/_build/.vite/manifest.json": {
    "type": "application/json",
    "encoding": null,
    "etag": "\"1735-E6WyKtbwaO7JsKlyUwHSltVMTAw\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 5941,
    "path": "../public/_build/.vite/manifest.json"
  },
  "/img/hero.jpg": {
    "type": "image/jpeg",
    "etag": "\"3352f-vRaI6YymNc0O/VEjvP0GMuLYiH4\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 210223,
    "path": "../public/img/hero.jpg"
  },
  "/_server/assets/app-BOCq2485.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"8aee-E1ELLCR7P15+/bZUlCmHtJL29Fc\"",
    "mtime": "2026-07-17T01:01:13.866Z",
    "size": 35566,
    "path": "../public/_server/assets/app-BOCq2485.css"
  },
  "/_server/assets/app-BOCq2485.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"15e5-uM0TsLk6KgA+cMRC39+p4v+UVAQ\"",
    "mtime": "2026-07-17T01:01:13.935Z",
    "size": 5605,
    "path": "../public/_server/assets/app-BOCq2485.css.br"
  },
  "/img/promo.jpg": {
    "type": "image/jpeg",
    "etag": "\"36620-UbTdM2jBS5ne+BchK5nDD63gtaA\"",
    "mtime": "2026-07-17T01:01:13.860Z",
    "size": 222752,
    "path": "../public/img/promo.jpg"
  },
  "/_server/assets/app-BOCq2485.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1965-NaBEuhuPvUvv3x6WNjn10ViSZNE\"",
    "mtime": "2026-07-17T01:01:13.913Z",
    "size": 6501,
    "path": "../public/_server/assets/app-BOCq2485.css.gz"
  },
  "/_build/assets/Money-BFVoQFsZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"73-dT1Ws3QMAot4RmcyDwXYlEfbgOE\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 115,
    "path": "../public/_build/assets/Money-BFVoQFsZ.js"
  },
  "/_build/assets/ProductImage-BBA3ePvh.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"444-5twQe/fwRpOmc0uXfbzdcHQ4oZQ\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 1092,
    "path": "../public/_build/assets/ProductImage-BBA3ePvh.js"
  },
  "/_build/assets/ProductImage-BBA3ePvh.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"220-1u9iUuEX6bl7fHKlslxBgHaf+9U\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 544,
    "path": "../public/_build/assets/ProductImage-BBA3ePvh.js.br"
  },
  "/_build/assets/ProductImage-BBA3ePvh.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"27e-uoMwC0c2c5XyoXZRP904XEEz0Fs\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 638,
    "path": "../public/_build/assets/ProductImage-BBA3ePvh.js.gz"
  },
  "/_build/assets/PromoBanner-DfxIk5oi.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"fdf-Mu2uAhDaYSbsqWJotIh8wF1QanI\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 4063,
    "path": "../public/_build/assets/PromoBanner-DfxIk5oi.js"
  },
  "/_build/assets/PromoBanner-DfxIk5oi.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"5de-qSUeHafBXdrtNJW0rS/kTU5kLBU\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 1502,
    "path": "../public/_build/assets/PromoBanner-DfxIk5oi.js.br"
  },
  "/_build/assets/PromoBanner-DfxIk5oi.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6d7-0CKvCCQfvH6f89Lt881zZLf5iH4\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 1751,
    "path": "../public/_build/assets/PromoBanner-DfxIk5oi.js.gz"
  },
  "/_build/assets/RequireAuth-1rBPcrp7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"194-Jg26JsOC0nIFC3oF70uIBOX66FM\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 404,
    "path": "../public/_build/assets/RequireAuth-1rBPcrp7.js"
  },
  "/_build/assets/_combo_-BnaxPXPk.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"164d-jAitPJFq3zOuVaTTzBEIX91pwQg\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 5709,
    "path": "../public/_build/assets/_combo_-BnaxPXPk.js"
  },
  "/_build/assets/_combo_-BnaxPXPk.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"836-9jaolFbCeMSGCOnh05EsFfP0nJo\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 2102,
    "path": "../public/_build/assets/_combo_-BnaxPXPk.js.br"
  },
  "/_build/assets/_combo_-BnaxPXPk.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"94c-gQU92jfa3fZsIREBjIaz0w276zk\"",
    "mtime": "2026-07-17T01:01:13.877Z",
    "size": 2380,
    "path": "../public/_build/assets/_combo_-BnaxPXPk.js.gz"
  },
  "/_build/assets/_id_-D5Of7Oc1.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1225-f9RZAubj8dy5U6F7PvaboZKnvfE\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 4645,
    "path": "../public/_build/assets/_id_-D5Of7Oc1.js"
  },
  "/_build/assets/_id_-D5Of7Oc1.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"654-TT2RXL/tc87h1pXKx8foeQCTfxA\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 1620,
    "path": "../public/_build/assets/_id_-D5Of7Oc1.js.br"
  },
  "/_build/assets/_id_-D5Of7Oc1.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"72b-fKWB34mzdz1sSkwIm9eRz/gHkfs\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 1835,
    "path": "../public/_build/assets/_id_-D5Of7Oc1.js.gz"
  },
  "/_build/assets/_id_-DuMLBRSU.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1126-TCueCC3AflofNOjTPQRAJeXRM5k\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 4390,
    "path": "../public/_build/assets/_id_-DuMLBRSU.js"
  },
  "/_build/assets/_id_-DuMLBRSU.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"60f-H9GspiqMXKEovDTe3lXFubUAhmQ\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 1551,
    "path": "../public/_build/assets/_id_-DuMLBRSU.js.br"
  },
  "/_build/assets/api-id5mx5ww.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1004-UJI4e3ph35rEa3erVBytxlFgfLg\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 4100,
    "path": "../public/_build/assets/api-id5mx5ww.js"
  },
  "/_build/assets/_id_-DuMLBRSU.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"6ea-HAh8XT1RUD790jA7/IF2hmKlmPA\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 1770,
    "path": "../public/_build/assets/_id_-DuMLBRSU.js.gz"
  },
  "/_build/assets/api-id5mx5ww.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"6ae-dglJDRlTrqirQWx9uaT8Yxrmkpw\"",
    "mtime": "2026-07-17T01:01:13.887Z",
    "size": 1710,
    "path": "../public/_build/assets/api-id5mx5ww.js.br"
  },
  "/_build/assets/api-id5mx5ww.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"77b-81wMg7ODtoNDljM6pCOTpLY86hY\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 1915,
    "path": "../public/_build/assets/api-id5mx5ww.js.gz"
  },
  "/_build/assets/cart-Cot-aues.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"20e-fpY2Bk6X7PZhYi8QI16OC5Jegg8\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 526,
    "path": "../public/_build/assets/cart-Cot-aues.js.br"
  },
  "/_build/assets/cart-Cot-aues.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"4c6-0B3s6DKG7SRSWYD7sn3wCQ+W4Io\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 1222,
    "path": "../public/_build/assets/cart-Cot-aues.js"
  },
  "/_build/assets/cart-Cot-aues.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"250-5tb3Q3BH3HwrWNbA9tLhOeEr9/E\"",
    "mtime": "2026-07-17T01:01:13.884Z",
    "size": 592,
    "path": "../public/_build/assets/cart-Cot-aues.js.gz"
  },
  "/_build/assets/cart-DJPzsvJb.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"e3d-h6iABnM+2EVKWIseaQXoYNzMtio\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 3645,
    "path": "../public/_build/assets/cart-DJPzsvJb.js"
  },
  "/_build/assets/cart-DJPzsvJb.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"56b-ft19VCzCyVoyJrKt6DPAePjKXzw\"",
    "mtime": "2026-07-17T01:01:13.887Z",
    "size": 1387,
    "path": "../public/_build/assets/cart-DJPzsvJb.js.br"
  },
  "/_build/assets/cart-DJPzsvJb.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"622-zs6knqBMumMzo2F3jIs3YMyUZqU\"",
    "mtime": "2026-07-17T01:01:13.887Z",
    "size": 1570,
    "path": "../public/_build/assets/cart-DJPzsvJb.js.gz"
  },
  "/_build/assets/checkout-BYgTbCLE.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"2680-OV6TrQmBDob8T3OGLCZvBQtPzI4\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 9856,
    "path": "../public/_build/assets/checkout-BYgTbCLE.js"
  },
  "/_build/assets/checkout-BYgTbCLE.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"d1d-IL1zYnXB+Gw1rQgQWIcvGDARJvA\"",
    "mtime": "2026-07-17T01:01:13.897Z",
    "size": 3357,
    "path": "../public/_build/assets/checkout-BYgTbCLE.js.br"
  },
  "/_build/assets/checkout-BYgTbCLE.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"f15-7ZmbjMWfBUr2GBNsPdjpobU9PlQ\"",
    "mtime": "2026-07-17T01:01:13.887Z",
    "size": 3861,
    "path": "../public/_build/assets/checkout-BYgTbCLE.js.gz"
  },
  "/_build/assets/client-BOCq2485.css": {
    "type": "text/css; charset=utf-8",
    "encoding": null,
    "etag": "\"8aee-E1ELLCR7P15+/bZUlCmHtJL29Fc\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 35566,
    "path": "../public/_build/assets/client-BOCq2485.css"
  },
  "/_build/assets/client-BOCq2485.css.br": {
    "type": "text/css; charset=utf-8",
    "encoding": "br",
    "etag": "\"15e5-uM0TsLk6KgA+cMRC39+p4v+UVAQ\"",
    "mtime": "2026-07-17T01:01:13.911Z",
    "size": 5605,
    "path": "../public/_build/assets/client-BOCq2485.css.br"
  },
  "/_build/assets/client-BOCq2485.css.gz": {
    "type": "text/css; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"1965-NaBEuhuPvUvv3x6WNjn10ViSZNE\"",
    "mtime": "2026-07-17T01:01:13.888Z",
    "size": 6501,
    "path": "../public/_build/assets/client-BOCq2485.css.gz"
  },
  "/_build/assets/client-DnCDWI_f.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"612b-JWZylQ/9bITZCFlTavNa5iYy/N8\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 24875,
    "path": "../public/_build/assets/client-DnCDWI_f.js"
  },
  "/_build/assets/client-DnCDWI_f.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"20f7-uVCZXc120QNUVZqMXshHon34B40\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 8439,
    "path": "../public/_build/assets/client-DnCDWI_f.js.br"
  },
  "/_build/assets/client-DnCDWI_f.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"2560-CI0IVLUawW6N5LKdDCyU7kQS9fA\"",
    "mtime": "2026-07-17T01:01:13.897Z",
    "size": 9568,
    "path": "../public/_build/assets/client-DnCDWI_f.js.gz"
  },
  "/_build/assets/combos-Dyt9v_Yz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28a-bpTHuH0coisfwPHgrTIwbN4vXuE\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 650,
    "path": "../public/_build/assets/combos-Dyt9v_Yz.js"
  },
  "/_build/assets/i18n-DhC8pOTw.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"af25-rQrzZYL8Lm9eEoWuqSqhvlk485A\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 44837,
    "path": "../public/_build/assets/i18n-DhC8pOTw.js"
  },
  "/_build/assets/i18n-DhC8pOTw.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"42f1-Kxy3TlRqJA7evGf+iySbFlvfqUw\"",
    "mtime": "2026-07-17T01:01:13.906Z",
    "size": 17137,
    "path": "../public/_build/assets/i18n-DhC8pOTw.js.gz"
  },
  "/_build/assets/i18n-DhC8pOTw.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"3c1c-xB5MZ7yfPJTzDlbW0hjx7dq/Fd8\"",
    "mtime": "2026-07-17T01:01:13.925Z",
    "size": 15388,
    "path": "../public/_build/assets/i18n-DhC8pOTw.js.br"
  },
  "/_build/assets/index-CYwdsy7E.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"c36-BHw2WAc4fi32c5TBCdLa1L6Hr98\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 3126,
    "path": "../public/_build/assets/index-CYwdsy7E.js"
  },
  "/_build/assets/index-CYwdsy7E.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"4df-kwa3n8nbyGmAXWsBOnkAnuFZbUk\"",
    "mtime": "2026-07-17T01:01:13.906Z",
    "size": 1247,
    "path": "../public/_build/assets/index-CYwdsy7E.js.br"
  },
  "/_build/assets/index-CYwdsy7E.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"5a1-CKeLw4/1L/cq0T71zP/fkqpeOvc\"",
    "mtime": "2026-07-17T01:01:13.906Z",
    "size": 1441,
    "path": "../public/_build/assets/index-CYwdsy7E.js.gz"
  },
  "/_build/assets/index-kPpelr90.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"1a29-YcDPza0Ie00hSEvlO9ezj3OraIo\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 6697,
    "path": "../public/_build/assets/index-kPpelr90.js"
  },
  "/_build/assets/index-kPpelr90.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"943-weSn2QG+mzdkyYRQq7wgDgwS5CA\"",
    "mtime": "2026-07-17T01:01:13.906Z",
    "size": 2371,
    "path": "../public/_build/assets/index-kPpelr90.js.br"
  },
  "/_build/assets/index-kPpelr90.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"a9b-sYSogk/8c1r5L/qmp5sp1wzxmd8\"",
    "mtime": "2026-07-17T01:01:13.906Z",
    "size": 2715,
    "path": "../public/_build/assets/index-kPpelr90.js.gz"
  },
  "/_build/assets/index-ogCbY43q.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"800-uKyc9REcs/46FAQBpgftPIC/Dkg\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 2048,
    "path": "../public/_build/assets/index-ogCbY43q.js"
  },
  "/_build/assets/index-ogCbY43q.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"374-xeEfEm2niaaQ6Vmw2DVdRsH902I\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 884,
    "path": "../public/_build/assets/index-ogCbY43q.js.br"
  },
  "/_build/assets/index-ogCbY43q.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3f0-Ez3XINvJCal1F7jwQ3+H2Xk0bHw\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 1008,
    "path": "../public/_build/assets/index-ogCbY43q.js.gz"
  },
  "/_build/assets/index-spayGTqs.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"145b-I0FBZpOqTZKIpBq/DqGDCECBZEs\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 5211,
    "path": "../public/_build/assets/index-spayGTqs.js"
  },
  "/_build/assets/index-spayGTqs.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"756-H+/GuQYanPpsk1X0j9G+lG1tKNI\"",
    "mtime": "2026-07-17T01:01:13.913Z",
    "size": 1878,
    "path": "../public/_build/assets/index-spayGTqs.js.br"
  },
  "/_build/assets/index-spayGTqs.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"862-+80Sh098uCcySO8fAxVMPQ6W+Fs\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 2146,
    "path": "../public/_build/assets/index-spayGTqs.js.gz"
  },
  "/_build/assets/login-C9VI-_Mt.js": {
    "type": "text/javascript; charset=utf-8",
    "encoding": null,
    "etag": "\"74f-m52ry2+cBhzZJBLfQfHdpXHND0s\"",
    "mtime": "2026-07-17T01:01:13.864Z",
    "size": 1871,
    "path": "../public/_build/assets/login-C9VI-_Mt.js"
  },
  "/_build/assets/login-C9VI-_Mt.js.br": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "br",
    "etag": "\"344-1jWsXz1THDRiBpm0TLiPM+YAABs\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 836,
    "path": "../public/_build/assets/login-C9VI-_Mt.js.br"
  },
  "/_build/assets/login-C9VI-_Mt.js.gz": {
    "type": "text/javascript; charset=utf-8",
    "encoding": "gzip",
    "etag": "\"3e0-vdQNuH/PSZhasQlvdO5l2D5leo0\"",
    "mtime": "2026-07-17T01:01:13.908Z",
    "size": 992,
    "path": "../public/_build/assets/login-C9VI-_Mt.js.gz"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _EVBIAF = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Wr$1(e, t) {
  const r = (e || "").split(";").filter((c) => typeof c == "string" && !!c.trim()), n = r.shift() || "", a = Xr(n), o = a.name;
  let i = a.value;
  try {
    i = (t == null ? void 0 : t.decode) === false ? i : ((t == null ? void 0 : t.decode) || decodeURIComponent)(i);
  } catch {
  }
  const u = { name: o, value: i };
  for (const c of r) {
    const l = c.split("="), p = (l.shift() || "").trimStart().toLowerCase(), d = l.join("=");
    switch (p) {
      case "expires": {
        u.expires = new Date(d);
        break;
      }
      case "max-age": {
        u.maxAge = Number.parseInt(d, 10);
        break;
      }
      case "secure": {
        u.secure = true;
        break;
      }
      case "httponly": {
        u.httpOnly = true;
        break;
      }
      case "samesite": {
        u.sameSite = d;
        break;
      }
      default:
        u[p] = d;
    }
  }
  return u;
}
function Xr(e) {
  let t = "", r = "";
  const n = e.split("=");
  return n.length > 1 ? (t = n.shift(), r = n.join("=")) : r = e, { name: t, value: r };
}
function Gr$1(e = {}) {
  let t, r = false;
  const n = (i) => {
    if (t && t !== i) throw new Error("Context conflict");
  };
  let a;
  if (e.asyncContext) {
    const i = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    i ? a = new i() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const o = () => {
    if (a) {
      const i = a.getStore();
      if (i !== void 0) return i;
    }
    return t;
  };
  return { use: () => {
    const i = o();
    if (i === void 0) throw new Error("Context is not available");
    return i;
  }, tryUse: () => o(), set: (i, u) => {
    u || n(i), t = i, r = true;
  }, unset: () => {
    t = void 0, r = false;
  }, call: (i, u) => {
    n(i), t = i;
    try {
      return a ? a.run(i, u) : u();
    } finally {
      r || (t = void 0);
    }
  }, async callAsync(i, u) {
    t = i;
    const c = () => {
      t = i;
    }, l = () => t === i ? c : void 0;
    Me$1.add(l);
    try {
      const p = a ? a.run(i, u) : u();
      return r || (t = void 0), await p;
    } finally {
      Me$1.delete(l);
    }
  } };
}
function Jr$1(e = {}) {
  const t = {};
  return { get(r, n = {}) {
    return t[r] || (t[r] = Gr$1({ ...e, ...n })), t[r];
  } };
}
const oe$1 = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, je$1 = "__unctx__", Yr$1 = oe$1[je$1] || (oe$1[je$1] = Jr$1()), Kr$1 = (e, t = {}) => Yr$1.get(e, t), He$1 = "__unctx_async_handlers__", Me$1 = oe$1[He$1] || (oe$1[He$1] = /* @__PURE__ */ new Set());
function Qr$1(e) {
  let t;
  const r = bt$1(e), n = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...n, body: e.node.req.body }) : new Request(r, { ...n, get body() {
    return t || (t = cn$1(e), t);
  } });
}
function Zr(e) {
  var _a2;
  return (_a2 = e.web) != null ? _a2 : e.web = { request: Qr$1(e), url: bt$1(e) }, e.web.request;
}
function en() {
  return dn();
}
const mt$1 = /* @__PURE__ */ Symbol("$HTTPEvent");
function tn(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[mt$1]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function S$3(e) {
  return function(...t) {
    var _a2;
    let r = t[0];
    if (tn(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[mt$1];
    else {
      if (!((_a2 = globalThis.app.config.server.experimental) == null ? void 0 : _a2.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = en(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const bt$1 = S$3(getRequestURL), rn = S$3(getRequestIP), ie$2 = S$3(setResponseStatus), Be$1 = S$3(getResponseStatus), nn = S$3(getResponseStatusText), se$2 = S$3(getResponseHeaders), Ve$1 = S$3(getResponseHeader), sn = S$3(setResponseHeader), yt$1 = S$3(appendResponseHeader), an = S$3(parseCookies), on = S$3(getCookie), un = S$3(setCookie), q$2 = S$3(setHeader), cn$1 = S$3(getRequestWebStream), ln = S$3(removeResponseHeader), fn = S$3(Zr);
function pn() {
  var _a2;
  return Kr$1("nitro-app", { asyncContext: !!((_a2 = globalThis.app.config.server.experimental) == null ? void 0 : _a2.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function dn() {
  return pn().use().event;
}
const de$1 = "Invariant Violation", { setPrototypeOf: hn = function(e, t) {
  return e.__proto__ = t, e;
} } = Object;
class ke extends Error {
  constructor(t = de$1) {
    super(typeof t == "number" ? `${de$1}: ${t} (see https://github.com/apollographql/invariant-packages)` : t);
    __publicField$1(this, "framesToPop", 1);
    __publicField$1(this, "name", de$1);
    hn(this, ke.prototype);
  }
}
function gn(e, t) {
  if (!e) throw new ke(t);
}
const he$1 = "solidFetchEvent";
function mn(e) {
  return { request: fn(e), response: vn(e), clientAddress: rn(e), locals: {}, nativeEvent: e };
}
function bn(e) {
  return { ...e };
}
function yn(e) {
  if (!e.context[he$1]) {
    const t = mn(e);
    e.context[he$1] = t;
  }
  return e.context[he$1];
}
function We$1(e, t) {
  for (const [r, n] of t.entries()) yt$1(e, r, n);
}
class wn {
  constructor(t) {
    __publicField$1(this, "event");
    this.event = t;
  }
  get(t) {
    const r = Ve$1(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, r) {
    return sn(this.event, t, r);
  }
  delete(t) {
    return ln(this.event, t);
  }
  append(t, r) {
    yt$1(this.event, t, r);
  }
  getSetCookie() {
    const t = Ve$1(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(se$2(this.event)).forEach(([r, n]) => t(Array.isArray(n) ? n.join(", ") : n, r, this));
  }
  entries() {
    return Object.entries(se$2(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(se$2(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(se$2(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function vn(e) {
  return { get status() {
    return Be$1(e);
  }, set status(t) {
    ie$2(e, t);
  }, get statusText() {
    return nn(e);
  }, set statusText(t) {
    ie$2(e, Be$1(e), t);
  }, headers: new wn(e) };
}
const H$2 = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function Sn(e = {}) {
  const t = { options: e, rootNode: wt$1(), staticRoutesMap: {} }, r = (n) => e.strictTrailingSlash ? n : n.replace(/\/$/, "") || "/";
  if (e.routes) for (const n in e.routes) Xe$1(t, r(n), e.routes[n]);
  return { ctx: t, lookup: (n) => En(t, r(n)), insert: (n, a) => Xe$1(t, r(n), a), remove: (n) => Rn(t, r(n)) };
}
function En(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const n = t.split("/"), a = {};
  let o = false, i = null, u = e.rootNode, c = null;
  for (let l = 0; l < n.length; l++) {
    const p = n[l];
    u.wildcardChildNode !== null && (i = u.wildcardChildNode, c = n.slice(l).join("/"));
    const d = u.children.get(p);
    if (d === void 0) {
      if (u && u.placeholderChildren.length > 1) {
        const w = n.length - l;
        u = u.placeholderChildren.find((f) => f.maxDepth === w) || null;
      } else u = u.placeholderChildren[0] || null;
      if (!u) break;
      u.paramName && (a[u.paramName] = p), o = true;
    } else u = d;
  }
  return (u === null || u.data === null) && i !== null && (u = i, a[u.paramName || "_"] = c, o = true), u ? o ? { ...u.data, params: o ? a : void 0 } : u.data : null;
}
function Xe$1(e, t, r) {
  let n = true;
  const a = t.split("/");
  let o = e.rootNode, i = 0;
  const u = [o];
  for (const c of a) {
    let l;
    if (l = o.children.get(c)) o = l;
    else {
      const p = xn(c);
      l = wt$1({ type: p, parent: o }), o.children.set(c, l), p === H$2.PLACEHOLDER ? (l.paramName = c === "*" ? `_${i++}` : c.slice(1), o.placeholderChildren.push(l), n = false) : p === H$2.WILDCARD && (o.wildcardChildNode = l, l.paramName = c.slice(3) || "_", n = false), u.push(l), o = l;
    }
  }
  for (const [c, l] of u.entries()) l.maxDepth = Math.max(u.length - c, l.maxDepth || 0);
  return o.data = r, n === true && (e.staticRoutesMap[t] = o), o;
}
function Rn(e, t) {
  let r = false;
  const n = t.split("/");
  let a = e.rootNode;
  for (const o of n) if (a = a.children.get(o), !a) return r;
  if (a.data) {
    const o = n.at(-1) || "";
    a.data = null, Object.keys(a.children).length === 0 && a.parent && (a.parent.children.delete(o), a.parent.wildcardChildNode = null, a.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function wt$1(e = {}) {
  return { type: e.type || H$2.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function xn(e) {
  return e.startsWith("**") ? H$2.WILDCARD : e[0] === ":" || e === "*" ? H$2.PLACEHOLDER : H$2.NORMAL;
}
const vt$2 = [{ page: true, $component: { src: "src/routes/cart.tsx?pick=default&pick=$css", build: () => import('./chunks/build/cart.mjs'), import: () => import('./chunks/build/cart.mjs') }, path: "/cart", filePath: "/Users/hector/Documents/marquet/src/routes/cart.tsx" }, { page: true, $component: { src: "src/routes/checkout.tsx?pick=default&pick=$css", build: () => import('./chunks/build/checkout.mjs'), import: () => import('./chunks/build/checkout.mjs') }, path: "/checkout", filePath: "/Users/hector/Documents/marquet/src/routes/checkout.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index.mjs'), import: () => import('./chunks/build/index.mjs') }, path: "/", filePath: "/Users/hector/Documents/marquet/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/login.tsx?pick=default&pick=$css", build: () => import('./chunks/build/login.mjs'), import: () => import('./chunks/build/login.mjs') }, path: "/login", filePath: "/Users/hector/Documents/marquet/src/routes/login.tsx" }, { page: true, $component: { src: "src/routes/ofertas/[combo].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_combo_.mjs'), import: () => import('./chunks/build/_combo_.mjs') }, path: "/ofertas/:combo", filePath: "/Users/hector/Documents/marquet/src/routes/ofertas/[combo].tsx" }, { page: true, $component: { src: "src/routes/ofertas/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index2.mjs'), import: () => import('./chunks/build/index2.mjs') }, path: "/ofertas/", filePath: "/Users/hector/Documents/marquet/src/routes/ofertas/index.tsx" }, { page: true, $component: { src: "src/routes/orders/[id].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_id_.mjs'), import: () => import('./chunks/build/_id_.mjs') }, path: "/orders/:id", filePath: "/Users/hector/Documents/marquet/src/routes/orders/[id].tsx" }, { page: true, $component: { src: "src/routes/orders/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index3.mjs'), import: () => import('./chunks/build/index3.mjs') }, path: "/orders/", filePath: "/Users/hector/Documents/marquet/src/routes/orders/index.tsx" }, { page: true, $component: { src: "src/routes/product/[id].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_id_2.mjs'), import: () => import('./chunks/build/_id_2.mjs') }, path: "/product/:id", filePath: "/Users/hector/Documents/marquet/src/routes/product/[id].tsx" }], An = kn(vt$2.filter((e) => e.page));
function kn(e) {
  function t(r, n, a, o) {
    const i = Object.values(r).find((u) => a.startsWith(u.id + "/"));
    return i ? (t(i.children || (i.children = []), n, a.slice(i.id.length)), r) : (r.push({ ...n, id: a, path: a.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, n) => r.path.length - n.path.length).reduce((r, n) => t(r, n, n.path, n.path), []);
}
function _n(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
Sn({ routes: vt$2.reduce((e, t) => {
  if (!_n(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (n, a) => `**:${a}`).split("/").map((n) => n.startsWith(":") || n.startsWith("*") ? n : encodeURIComponent(n)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) });
var zn = " ";
const Cn = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(zn), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function Pn(e, t) {
  let { tag: r, attrs: { key: n, ...a } = { key: void 0 }, children: o } = e;
  return Cn[r]({ attrs: { ...a, nonce: t }, key: n, children: o });
}
function On(e, t, r, n = "default") {
  return lazy(async () => {
    var _a2;
    {
      const o = (await e.import())[n], u = (await ((_a2 = t.inputs) == null ? void 0 : _a2[e.src].assets())).filter((l) => l.tag === "style" || l.attrs.rel === "stylesheet");
      return { default: (l) => [...u.map((p) => Pn(p)), createComponent(o, l)] };
    }
  });
}
function St$1() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && On(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return An.map(e);
}
let Ge$1;
const au = isServer ? () => getRequestEvent().routes : () => Ge$1 || (Ge$1 = St$1());
function In(e) {
  const t = on(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const n = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], a = r.error ? new Error(r.result) : r.result;
    return { input: n, url: r.url, pending: false, result: r.thrown ? void 0 : a, error: r.thrown ? a : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    un(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function Ln(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: In(e) }, routes: St$1(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const Tn = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function Nn(e) {
  return e.status && Tn.has(e.status) ? e.status : 302;
}
const Un = {};
var Et$1 = ((e) => (e[e.AggregateError = 1] = "AggregateError", e[e.ArrowFunction = 2] = "ArrowFunction", e[e.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", e[e.ObjectAssign = 8] = "ObjectAssign", e[e.BigIntTypedArray = 16] = "BigIntTypedArray", e[e.RegExp = 32] = "RegExp", e))(Et$1 || {}), k$2 = Symbol.asyncIterator, Rt$1 = Symbol.hasInstance, M$2 = Symbol.isConcatSpreadable, _ = Symbol.iterator, xt$1 = Symbol.match, At$1 = Symbol.matchAll, kt$2 = Symbol.replace, _t$1 = Symbol.search, $t$1 = Symbol.species, zt$1 = Symbol.split, Ct$1 = Symbol.toPrimitive, B$1 = Symbol.toStringTag, Pt$1 = Symbol.unscopables, Fn = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, Ot$1 = { [k$2]: 0, [Rt$1]: 1, [M$2]: 2, [_]: 3, [xt$1]: 4, [At$1]: 5, [kt$2]: 6, [_t$1]: 7, [$t$1]: 8, [zt$1]: 9, [Ct$1]: 10, [B$1]: 11, [Pt$1]: 12 }, Dn = { 0: k$2, 1: Rt$1, 2: M$2, 3: _, 4: xt$1, 5: At$1, 6: kt$2, 7: _t$1, 8: $t$1, 9: zt$1, 10: Ct$1, 11: B$1, 12: Pt$1 }, qn = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, s = void 0, jn = { 2: true, 3: false, 1: s, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN }, It$1 = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, Hn = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError };
function g$2(e, t, r, n, a, o, i, u, c, l, p, d) {
  return { t: e, i: t, s: r, c: n, m: a, p: o, e: i, a: u, f: c, b: l, o: p, l: d };
}
function O(e) {
  return g$2(2, s, e, s, s, s, s, s, s, s, s, s);
}
var Lt$1 = O(2), Tt$1 = O(3), Mn = O(1), Bn = O(0), Vn = O(4), Wn = O(5), Xn = O(6), Gn = O(7);
function Jn(e) {
  switch (e) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return s;
  }
}
function x$2(e) {
  let t = "", r = 0, n;
  for (let a = 0, o = e.length; a < o; a++) n = Jn(e[a]), n && (t += e.slice(r, a) + n, r = a + 1);
  return r === 0 ? t = e : t += e.slice(r), t;
}
function Yn(e) {
  switch (e) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return e;
  }
}
function I$3(e) {
  return e.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, Yn);
}
var G = "__SEROVAL_REFS__", ue$1 = "$R", ae$2 = `self.${ue$1}`;
function Kn(e) {
  return e == null ? `${ae$2}=${ae$2}||[]` : `(${ae$2}=${ae$2}||{})["${x$2(e)}"]=[]`;
}
var Nt$1 = /* @__PURE__ */ new Map(), j$3 = /* @__PURE__ */ new Map();
function Ut$1(e) {
  return Nt$1.has(e);
}
function Qn(e) {
  return j$3.has(e);
}
function Zn(e) {
  if (Ut$1(e)) return Nt$1.get(e);
  throw new $s(e);
}
function es(e) {
  if (Qn(e)) return j$3.get(e);
  throw new zs(e);
}
typeof globalThis < "u" ? Object.defineProperty(globalThis, G, { value: j$3, configurable: true, writable: false, enumerable: false }) : typeof self < "u" ? Object.defineProperty(self, G, { value: j$3, configurable: true, writable: false, enumerable: false }) : typeof global < "u" && Object.defineProperty(global, G, { value: j$3, configurable: true, writable: false, enumerable: false });
function _e$1(e) {
  return e instanceof EvalError ? 1 : e instanceof RangeError ? 2 : e instanceof ReferenceError ? 3 : e instanceof SyntaxError ? 4 : e instanceof TypeError ? 5 : e instanceof URIError ? 6 : 0;
}
function ts(e) {
  let t = It$1[_e$1(e)];
  return e.name !== t ? { name: e.name } : e.constructor.name !== t ? { name: e.constructor.name } : {};
}
function Ft$1(e, t) {
  let r = ts(e), n = Object.getOwnPropertyNames(e);
  for (let a = 0, o = n.length, i; a < o; a++) i = n[a], i !== "name" && i !== "message" && (i === "stack" ? t & 4 && (r = r || {}, r[i] = e[i]) : (r = r || {}, r[i] = e[i]));
  return r;
}
function Dt$1(e) {
  return Object.isFrozen(e) ? 3 : Object.isSealed(e) ? 2 : Object.isExtensible(e) ? 0 : 1;
}
function rs(e) {
  switch (e) {
    case Number.POSITIVE_INFINITY:
      return Wn;
    case Number.NEGATIVE_INFINITY:
      return Xn;
  }
  return e !== e ? Gn : Object.is(e, -0) ? Vn : g$2(0, s, e, s, s, s, s, s, s, s, s, s);
}
function qt$1(e) {
  return g$2(1, s, x$2(e), s, s, s, s, s, s, s, s, s);
}
function ns(e) {
  return g$2(3, s, "" + e, s, s, s, s, s, s, s, s, s);
}
function ss(e) {
  return g$2(4, e, s, s, s, s, s, s, s, s, s, s);
}
function as(e, t) {
  let r = t.valueOf();
  return g$2(5, e, r !== r ? "" : t.toISOString(), s, s, s, s, s, s, s, s, s);
}
function os(e, t) {
  return g$2(6, e, s, x$2(t.source), t.flags, s, s, s, s, s, s, s);
}
function is(e, t) {
  return g$2(17, e, Ot$1[t], s, s, s, s, s, s, s, s, s);
}
function us(e, t) {
  return g$2(18, e, x$2(Zn(t)), s, s, s, s, s, s, s, s, s);
}
function jt$1(e, t, r) {
  return g$2(25, e, r, x$2(t), s, s, s, s, s, s, s, s);
}
function cs(e, t, r) {
  return g$2(9, e, s, s, s, s, s, r, s, s, Dt$1(t), s);
}
function ls(e, t) {
  return g$2(21, e, s, s, s, s, s, s, t, s, s, s);
}
function fs(e, t, r) {
  return g$2(15, e, s, t.constructor.name, s, s, s, s, r, t.byteOffset, s, t.length);
}
function ps(e, t, r) {
  return g$2(16, e, s, t.constructor.name, s, s, s, s, r, t.byteOffset, s, t.byteLength);
}
function ds(e, t, r) {
  return g$2(20, e, s, s, s, s, s, s, r, t.byteOffset, s, t.byteLength);
}
function hs(e, t, r) {
  return g$2(13, e, _e$1(t), s, x$2(t.message), r, s, s, s, s, s, s);
}
function gs(e, t, r) {
  return g$2(14, e, _e$1(t), s, x$2(t.message), r, s, s, s, s, s, s);
}
function ms(e, t) {
  return g$2(7, e, s, s, s, s, s, t, s, s, s, s);
}
function bs(e, t) {
  return g$2(28, s, s, s, s, s, s, [e, t], s, s, s, s);
}
function ys(e, t) {
  return g$2(30, s, s, s, s, s, s, [e, t], s, s, s, s);
}
function ws(e, t, r) {
  return g$2(31, e, s, s, s, s, s, r, t, s, s, s);
}
function vs(e, t) {
  return g$2(32, e, s, s, s, s, s, s, t, s, s, s);
}
function Ss(e, t) {
  return g$2(33, e, s, s, s, s, s, s, t, s, s, s);
}
function Es(e, t) {
  return g$2(34, e, s, s, s, s, s, s, t, s, s, s);
}
function Rs(e, t, r, n) {
  return g$2(35, e, r, s, s, s, s, t, s, s, s, n);
}
var xs = { parsing: 1, serialization: 2, deserialization: 3 };
function As(e) {
  return `Seroval Error (step: ${xs[e]})`;
}
var ks = (e, t) => As(e), Ht$1 = class Ht extends Error {
  constructor(t, r) {
    super(ks(t)), this.cause = r;
  }
}, Je$1 = class Je extends Ht$1 {
  constructor(e) {
    super("parsing", e);
  }
}, _s = class extends Ht$1 {
  constructor(e) {
    super("deserialization", e);
  }
};
function $$1(e) {
  return `Seroval Error (specific: ${e})`;
}
var ce$2 = class ce extends Error {
  constructor(t) {
    super($$1(1)), this.value = t;
  }
}, U$2 = class U extends Error {
  constructor(t) {
    super($$1(2));
  }
}, Mt$1 = class Mt extends Error {
  constructor(e) {
    super($$1(3));
  }
}, Z$1 = class Z extends Error {
  constructor(t) {
    super($$1(4));
  }
}, $s = class extends Error {
  constructor(e) {
    super($$1(5)), this.value = e;
  }
}, zs = class extends Error {
  constructor(e) {
    super($$1(6));
  }
}, Cs = class extends Error {
  constructor(e) {
    super($$1(7));
  }
}, z$1 = class z extends Error {
  constructor(t) {
    super($$1(8));
  }
}, Bt$1 = class Bt extends Error {
  constructor(e) {
    super($$1(9));
  }
}, Ps = class {
  constructor(e, t) {
    this.value = e, this.replacement = t;
  }
}, le$1 = () => {
  let e = { p: 0, s: 0, f: 0 };
  return e.p = new Promise((t, r) => {
    e.s = t, e.f = r;
  }), e;
}, Os = (e, t) => {
  e.s(t), e.p.s = 1, e.p.v = t;
}, Is = (e, t) => {
  e.f(t), e.p.s = 2, e.p.v = t;
}, Ls = le$1.toString(), Ts = Os.toString(), Ns = Is.toString(), Vt$1 = () => {
  let e = [], t = [], r = true, n = false, a = 0, o = (c, l, p) => {
    for (p = 0; p < a; p++) t[p] && t[p][l](c);
  }, i = (c, l, p, d) => {
    for (l = 0, p = e.length; l < p; l++) d = e[l], !r && l === p - 1 ? c[n ? "return" : "throw"](d) : c.next(d);
  }, u = (c, l) => (r && (l = a++, t[l] = c), i(c), () => {
    r && (t[l] = t[a], t[a--] = void 0);
  });
  return { __SEROVAL_STREAM__: true, on: (c) => u(c), next: (c) => {
    r && (e.push(c), o(c, "next"));
  }, throw: (c) => {
    r && (e.push(c), o(c, "throw"), r = false, n = false, t.length = 0);
  }, return: (c) => {
    r && (e.push(c), o(c, "return"), r = false, n = true, t.length = 0);
  } };
}, Us = Vt$1.toString(), Wt$1 = (e) => (t) => () => {
  let r = 0, n = { [e]: () => n, next: () => {
    if (r > t.d) return { done: true, value: void 0 };
    let a = r++, o = t.v[a];
    if (a === t.t) throw o;
    return { done: a === t.d, value: o };
  } };
  return n;
}, Fs = Wt$1.toString(), Xt = (e, t) => (r) => () => {
  let n = 0, a = -1, o = false, i = [], u = [], c = (p = 0, d = u.length) => {
    for (; p < d; p++) u[p].s({ done: true, value: void 0 });
  };
  r.on({ next: (p) => {
    let d = u.shift();
    d && d.s({ done: false, value: p }), i.push(p);
  }, throw: (p) => {
    let d = u.shift();
    d && d.f(p), c(), a = i.length, o = true, i.push(p);
  }, return: (p) => {
    let d = u.shift();
    d && d.s({ done: true, value: p }), c(), a = i.length, i.push(p);
  } });
  let l = { [e]: () => l, next: () => {
    if (a === -1) {
      let w = n++;
      if (w >= i.length) {
        let f = t();
        return u.push(f), f.p;
      }
      return { done: false, value: i[w] };
    }
    if (n > a) return { done: true, value: void 0 };
    let p = n++, d = i[p];
    if (p !== a) return { done: false, value: d };
    if (o) throw d;
    return { done: true, value: d };
  } };
  return l;
}, Ds = Xt.toString(), Gt$1 = (e) => {
  let t = atob(e), r = t.length, n = new Uint8Array(r);
  for (let a = 0; a < r; a++) n[a] = t.charCodeAt(a);
  return n.buffer;
}, qs = Gt$1.toString();
function js(e) {
  return "__SEROVAL_SEQUENCE__" in e;
}
function Jt$1(e, t, r) {
  return { __SEROVAL_SEQUENCE__: true, v: e, t, d: r };
}
function Hs(e) {
  let t = [], r = -1, n = -1, a = e[_]();
  for (; ; ) try {
    let o = a.next();
    if (t.push(o.value), o.done) {
      n = t.length - 1;
      break;
    }
  } catch (o) {
    r = t.length, t.push(o);
  }
  return Jt$1(t, r, n);
}
var Ms = Wt$1(_);
function Bs(e) {
  return Ms(e);
}
var Vs = {}, Ws = {}, Xs = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }, Gs = { 0: "[]", 1: Ls, 2: Ts, 3: Ns, 4: Us, 5: qs };
function Js(e) {
  return "__SEROVAL_STREAM__" in e;
}
function ee$2() {
  return Vt$1();
}
function Ys(e) {
  let t = ee$2(), r = e[k$2]();
  async function n() {
    try {
      let a = await r.next();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
var Ks = Xt(k$2, le$1);
function Qs(e) {
  return Ks(e);
}
function Zs(e, t) {
  return { plugins: t.plugins, mode: e, marked: /* @__PURE__ */ new Set(), features: 63 ^ (t.disabledFeatures || 0), refs: t.refs || /* @__PURE__ */ new Map(), depthLimit: t.depthLimit || 1e3 };
}
function ea(e, t) {
  e.marked.add(t);
}
function Yt$1(e, t) {
  let r = e.refs.size;
  return e.refs.set(t, r), r;
}
function fe$1(e, t) {
  let r = e.refs.get(t);
  return r != null ? (ea(e, r), { type: 1, value: ss(r) }) : { type: 0, value: Yt$1(e, t) };
}
function $e$1(e, t) {
  let r = fe$1(e, t);
  return r.type === 1 ? r : Ut$1(t) ? { type: 2, value: us(r.value, t) } : r;
}
function L(e, t) {
  let r = $e$1(e, t);
  if (r.type !== 0) return r.value;
  if (t in Ot$1) return is(r.value, t);
  throw new ce$2(t);
}
function F$2(e, t) {
  let r = fe$1(e, Xs[t]);
  return r.type === 1 ? r.value : g$2(26, r.value, t, s, s, s, s, s, s, s, s, s);
}
function ta(e) {
  let t = fe$1(e, Vs);
  return t.type === 1 ? t.value : g$2(27, t.value, s, s, s, s, s, s, L(e, _), s, s, s);
}
function ra(e) {
  let t = fe$1(e, Ws);
  return t.type === 1 ? t.value : g$2(29, t.value, s, s, s, s, s, [F$2(e, 1), L(e, k$2)], s, s, s, s);
}
function na(e, t, r, n) {
  return g$2(r ? 11 : 10, e, s, s, s, n, s, s, s, s, Dt$1(t), s);
}
function sa(e, t, r, n) {
  return g$2(8, t, s, s, s, s, { k: r, v: n }, s, F$2(e, 0), s, s, s);
}
function aa(e, t, r) {
  return g$2(22, t, r, s, s, s, s, s, F$2(e, 1), s, s, s);
}
function oa(e, t, r) {
  let n = new Uint8Array(r), a = "";
  for (let o = 0, i = n.length; o < i; o++) a += String.fromCharCode(n[o]);
  return g$2(19, t, x$2(btoa(a)), s, s, s, s, s, F$2(e, 5), s, s, s);
}
var ia = ((e) => (e[e.Vanilla = 1] = "Vanilla", e[e.Cross = 2] = "Cross", e))(ia || {});
function Kt$1(e, t) {
  for (let r = 0, n = t.length; r < n; r++) {
    let a = t[r];
    e.has(a) || (e.add(a), a.extends && Kt$1(e, a.extends));
  }
}
function ze$1(e) {
  if (e) {
    let t = /* @__PURE__ */ new Set();
    return Kt$1(t, e), [...t];
  }
}
function ua(e) {
  switch (e) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new Cs(e);
  }
}
var ca = 1e6, la = 1e4, fa = 2e4;
function Qt$1(e, t) {
  switch (t) {
    case 3:
      return Object.freeze(e);
    case 1:
      return Object.preventExtensions(e);
    case 2:
      return Object.seal(e);
    default:
      return e;
  }
}
var pa = 1e3;
function da(e, t) {
  var r;
  let n = t.refs || /* @__PURE__ */ new Map();
  return "types" in n || Object.assign(n, { types: /* @__PURE__ */ new Map() }), { mode: e, plugins: t.plugins, refs: n, features: (r = t.features) != null ? r : 63 ^ (t.disabledFeatures || 0), depthLimit: t.depthLimit || pa };
}
function ha(e) {
  return { mode: 1, base: da(1, e), child: s, state: { marked: new Set(e.markedRefs) } };
}
var ga = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  deserialize(e) {
    return b$1(this._p, this.depth, e);
  }
};
function Zt$1(e, t) {
  if (t < 0 || !Number.isFinite(t) || !Number.isInteger(t)) throw new z$1({ t: 4, i: t });
  if (e.refs.has(t)) throw new Error("Conflicted ref id: " + t);
}
function ma(e, t, r) {
  return Zt$1(e.base, t), e.state.marked.has(t) && e.base.refs.set(t, r), r;
}
function ba(e, t, r) {
  return Zt$1(e.base, t), e.base.refs.set(t, r), r;
}
function y$3(e, t, r) {
  return e.mode === 1 ? ma(e, t, r) : ba(e, t, r);
}
function Ee$1(e, t, r) {
  if (Object.hasOwn(t, r)) return t[r];
  throw new z$1(e);
}
function ya(e, t) {
  return y$3(e, t.i, es(I$3(t.s)));
}
function wa(e, t, r) {
  let n = r.a, a = n.length, o = y$3(e, r.i, new Array(a));
  for (let i = 0, u; i < a; i++) u = n[i], u && (o[i] = b$1(e, t, u));
  return Qt$1(o, r.o), o;
}
function va(e) {
  switch (e) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function Sa(e) {
  switch (e) {
    case k$2:
    case M$2:
    case B$1:
    case _:
      return true;
    default:
      return false;
  }
}
function Ye$1(e, t, r) {
  va(t) ? e[t] = r : Object.defineProperty(e, t, { value: r, configurable: true, enumerable: true, writable: true });
}
function Ea(e, t, r, n, a) {
  if (typeof n == "string") Ye$1(r, I$3(n), b$1(e, t, a));
  else {
    let o = b$1(e, t, n);
    switch (typeof o) {
      case "string":
        Ye$1(r, o, b$1(e, t, a));
        break;
      case "symbol":
        Sa(o) && (r[o] = b$1(e, t, a));
        break;
      default:
        throw new z$1(n);
    }
  }
}
function er$1(e, t, r) {
  e.base.refs.types.set(t, r);
}
function te$1(e, t, r, n) {
  if (e.base.refs.types.get(r) !== n) throw new z$1(t);
}
function tr$1(e, t, r, n) {
  let a = r.k;
  if (a.length > 0) for (let o = 0, i = r.v, u = a.length; o < u; o++) Ea(e, t, n, a[o], i[o]);
  return n;
}
function Ra(e, t, r) {
  let n = y$3(e, r.i, r.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
  return tr$1(e, t, r.p, n), Qt$1(n, r.o), n;
}
function xa(e, t) {
  return y$3(e, t.i, new Date(t.s));
}
function Aa(e, t) {
  if (e.base.features & 32) {
    let r = I$3(t.c);
    if (r.length > fa) throw new z$1(t);
    return y$3(e, t.i, new RegExp(r, t.m));
  }
  throw new U$2(t);
}
function ka(e, t, r) {
  let n = y$3(e, r.i, /* @__PURE__ */ new Set());
  for (let a = 0, o = r.a, i = o.length; a < i; a++) n.add(b$1(e, t, o[a]));
  return n;
}
function _a(e, t, r) {
  let n = y$3(e, r.i, /* @__PURE__ */ new Map());
  for (let a = 0, o = r.e.k, i = r.e.v, u = o.length; a < u; a++) n.set(b$1(e, t, o[a]), b$1(e, t, i[a]));
  return n;
}
function $a(e, t) {
  if (t.s.length > ca) throw new z$1(t);
  return y$3(e, t.i, Gt$1(I$3(t.s)));
}
function za(e, t, r) {
  var n;
  let a = ua(r.c), o = b$1(e, t, r.f), i = (n = r.b) != null ? n : 0;
  if (i < 0 || i > o.byteLength) throw new z$1(r);
  return y$3(e, r.i, new a(o, i, r.l));
}
function Ca(e, t, r) {
  var n;
  let a = b$1(e, t, r.f), o = (n = r.b) != null ? n : 0;
  if (o < 0 || o > a.byteLength) throw new z$1(r);
  return y$3(e, r.i, new DataView(a, o, r.l));
}
function rr$1(e, t, r, n) {
  if (r.p) {
    let a = tr$1(e, t, r.p, {});
    Object.defineProperties(n, Object.getOwnPropertyDescriptors(a));
  }
  return n;
}
function Pa(e, t, r) {
  let n = y$3(e, r.i, new AggregateError([], I$3(r.m)));
  return rr$1(e, t, r, n);
}
function Oa(e, t, r) {
  let n = Ee$1(r, Hn, r.s), a = y$3(e, r.i, new n(I$3(r.m)));
  return rr$1(e, t, r, a);
}
function Ia(e, t, r) {
  let n = le$1(), a = y$3(e, r.i, n.p), o = b$1(e, t, r.f);
  return r.s ? n.s(o) : n.f(o), a;
}
function La(e, t, r) {
  return y$3(e, r.i, Object(b$1(e, t, r.f)));
}
function Ta(e, t, r) {
  let n = e.base.plugins;
  if (n) {
    let a = I$3(r.c);
    for (let o = 0, i = n.length; o < i; o++) {
      let u = n[o];
      if (u.tag === a) return y$3(e, r.i, u.deserialize(r.s, new ga(e, t), { id: r.i }));
    }
  }
  throw new Mt$1(r.c);
}
function Na(e, t) {
  let r = y$3(e, t.i, y$3(e, t.s, le$1()).p);
  return er$1(e, t.s, 22), r;
}
function Ua(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return te$1(e, r, r.i, 22), n.s(b$1(e, t, r.a[1])), s;
  throw new Z$1("Promise");
}
function Fa(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return te$1(e, r, r.i, 22), n.f(b$1(e, t, r.a[1])), s;
  throw new Z$1("Promise");
}
function Da(e, t, r) {
  b$1(e, t, r.a[0]);
  let n = b$1(e, t, r.a[1]);
  return Bs(n);
}
function qa(e, t, r) {
  b$1(e, t, r.a[0]);
  let n = b$1(e, t, r.a[1]);
  return Qs(n);
}
function ja(e, t, r) {
  let n = y$3(e, r.i, ee$2());
  er$1(e, r.i, 31);
  let a = r.a, o = a.length;
  if (o) for (let i = 0; i < o; i++) b$1(e, t, a[i]);
  return n;
}
function Ha(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return te$1(e, r, r.i, 31), n.next(b$1(e, t, r.f)), s;
  throw new Z$1("Stream");
}
function Ma(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return te$1(e, r, r.i, 31), n.throw(b$1(e, t, r.f)), s;
  throw new Z$1("Stream");
}
function Ba(e, t, r) {
  let n = e.base.refs.get(r.i);
  if (n) return te$1(e, r, r.i, 31), n.return(b$1(e, t, r.f)), s;
  throw new Z$1("Stream");
}
function Va(e, t, r) {
  return b$1(e, t, r.f), s;
}
function Wa(e, t, r) {
  return b$1(e, t, r.a[1]), s;
}
function Xa(e, t, r) {
  let n = y$3(e, r.i, Jt$1([], r.s, r.l));
  for (let a = 0, o = r.a.length; a < o; a++) n.v[a] = b$1(e, t, r.a[a]);
  return n;
}
function b$1(e, t, r) {
  if (t > e.base.depthLimit) throw new Bt$1(e.base.depthLimit);
  switch (t += 1, r.t) {
    case 2:
      return Ee$1(r, jn, r.s);
    case 0:
      return Number(r.s);
    case 1:
      return I$3(String(r.s));
    case 3:
      if (String(r.s).length > la) throw new z$1(r);
      return BigInt(r.s);
    case 4:
      return e.base.refs.get(r.i);
    case 18:
      return ya(e, r);
    case 9:
      return wa(e, t, r);
    case 10:
    case 11:
      return Ra(e, t, r);
    case 5:
      return xa(e, r);
    case 6:
      return Aa(e, r);
    case 7:
      return ka(e, t, r);
    case 8:
      return _a(e, t, r);
    case 19:
      return $a(e, r);
    case 16:
    case 15:
      return za(e, t, r);
    case 20:
      return Ca(e, t, r);
    case 14:
      return Pa(e, t, r);
    case 13:
      return Oa(e, t, r);
    case 12:
      return Ia(e, t, r);
    case 17:
      return Ee$1(r, Dn, r.s);
    case 21:
      return La(e, t, r);
    case 25:
      return Ta(e, t, r);
    case 22:
      return Na(e, r);
    case 23:
      return Ua(e, t, r);
    case 24:
      return Fa(e, t, r);
    case 28:
      return Da(e, t, r);
    case 30:
      return qa(e, t, r);
    case 31:
      return ja(e, t, r);
    case 32:
      return Ha(e, t, r);
    case 33:
      return Ma(e, t, r);
    case 34:
      return Ba(e, t, r);
    case 27:
      return Va(e, t, r);
    case 29:
      return Wa(e, t, r);
    case 35:
      return Xa(e, t, r);
    default:
      throw new U$2(r);
  }
}
function Ga(e, t) {
  try {
    return b$1(e, 0, t);
  } catch (r) {
    throw new _s(r);
  }
}
var Ja = () => T, Ya = Ja.toString(), nr$1 = /=>/.test(Ya);
function sr$1(e, t) {
  return nr$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (t.startsWith("{") ? "(" + t + ")" : t) : "function(" + e.join(",") + "){return " + t + "}";
}
function Ka(e, t) {
  return nr$1 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + t + "}" : "function(" + e.join(",") + "){" + t + "}";
}
var ar$1 = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_", Ke$1 = ar$1.length, or$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_", Qe$1 = or$1.length;
function Qa(e) {
  let t = e % Ke$1, r = ar$1[t];
  for (e = (e - t) / Ke$1; e > 0; ) t = e % Qe$1, r += or$1[t], e = (e - t) / Qe$1;
  return r;
}
var Za = /^[$A-Z_][0-9A-Z_$]*$/i;
function ir$1(e) {
  let t = e[0];
  return (t === "$" || t === "_" || t >= "A" && t <= "Z" || t >= "a" && t <= "z") && Za.test(e);
}
function J(e) {
  switch (e.t) {
    case 0:
      return e.s + "=" + e.v;
    case 2:
      return e.s + ".set(" + e.k + "," + e.v + ")";
    case 1:
      return e.s + ".add(" + e.v + ")";
    case 3:
      return e.s + ".delete(" + e.k + ")";
  }
}
function eo(e) {
  let t = [], r = e[0];
  for (let n = 1, a = e.length, o, i = r; n < a; n++) o = e[n], o.t === 0 && o.v === i.v ? r = { t: 0, s: o.s, k: s, v: J(r) } : o.t === 2 && o.s === i.s ? r = { t: 2, s: J(r), k: o.k, v: o.v } : o.t === 1 && o.s === i.s ? r = { t: 1, s: J(r), k: s, v: o.v } : o.t === 3 && o.s === i.s ? r = { t: 3, s: J(r), k: o.k, v: s } : (t.push(r), r = o), i = o;
  return t.push(r), t;
}
function ur$1(e) {
  if (e.length) {
    let t = "", r = eo(e);
    for (let n = 0, a = r.length; n < a; n++) t += J(r[n]) + ",";
    return t;
  }
  return s;
}
var to = "Object.create(null)", ro = "new Set", no = "new Map", so = "Promise.resolve", ao = "Promise.reject", oo = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s };
function io(e, t) {
  return { mode: e, plugins: t.plugins, features: t.features, marked: new Set(t.markedRefs), stack: [], flags: [], assignments: [] };
}
function uo(e) {
  return { mode: 2, base: io(2, e), state: e, child: s };
}
var co = class {
  constructor(e) {
    this._p = e;
  }
  serialize(e) {
    return h(this._p, e);
  }
};
function lo(e, t) {
  let r = e.valid.get(t);
  r == null && (r = e.valid.size, e.valid.set(t, r));
  let n = e.vars[r];
  return n == null && (n = Qa(r), e.vars[r] = n), n;
}
function fo(e) {
  return ue$1 + "[" + e + "]";
}
function m$2(e, t) {
  return e.mode === 1 ? lo(e.state, t) : fo(t);
}
function E$1(e, t) {
  e.marked.add(t);
}
function Re$1(e, t) {
  return e.marked.has(t);
}
function Ce(e, t, r) {
  t !== 0 && (E$1(e.base, r), e.base.flags.push({ type: t, value: m$2(e, r) }));
}
function po(e) {
  let t = "";
  for (let r = 0, n = e.flags, a = n.length; r < a; r++) {
    let o = n[r];
    t += oo[o.type] + "(" + o.value + "),";
  }
  return t;
}
function ho(e) {
  let t = ur$1(e.assignments), r = po(e);
  return t ? r ? t + r : t : r;
}
function Pe(e, t, r) {
  e.assignments.push({ t: 0, s: t, k: s, v: r });
}
function go(e, t, r) {
  e.base.assignments.push({ t: 1, s: m$2(e, t), k: s, v: r });
}
function X$1(e, t, r, n) {
  e.base.assignments.push({ t: 2, s: m$2(e, t), k: r, v: n });
}
function Ze$1(e, t, r) {
  e.base.assignments.push({ t: 3, s: m$2(e, t), k: r, v: s });
}
function K(e, t, r, n) {
  Pe(e.base, m$2(e, t) + "[" + r + "]", n);
}
function xe$1(e, t, r, n) {
  Pe(e.base, m$2(e, t) + "." + r, n);
}
function mo(e, t, r, n) {
  Pe(e.base, m$2(e, t) + ".v[" + r + "]", n);
}
function A$1(e, t) {
  return t.t === 4 && e.stack.includes(t.i);
}
function W$1(e, t, r) {
  return e.mode === 1 && !Re$1(e.base, t) ? r : m$2(e, t) + "=" + r;
}
function bo(e) {
  return G + '.get("' + e.s + '")';
}
function et$1(e, t, r, n) {
  return r ? A$1(e.base, r) ? (E$1(e.base, t), K(e, t, n, m$2(e, r.i)), "") : h(e, r) : "";
}
function yo(e, t) {
  let r = t.i, n = t.a, a = n.length;
  if (a > 0) {
    e.base.stack.push(r);
    let o = et$1(e, r, n[0], 0), i = o === "";
    for (let u = 1, c; u < a; u++) c = et$1(e, r, n[u], u), o += "," + c, i = c === "";
    return e.base.stack.pop(), Ce(e, t.o, t.i), "[" + o + (i ? ",]" : "]");
  }
  return "[]";
}
function tt$1(e, t, r, n) {
  if (typeof r == "string") {
    let a = Number(r), o = a >= 0 && a.toString() === r || ir$1(r);
    if (A$1(e.base, n)) {
      let i = m$2(e, n.i);
      return E$1(e.base, t.i), o && a !== a ? xe$1(e, t.i, r, i) : K(e, t.i, o ? r : '"' + r + '"', i), "";
    }
    return (o ? r : '"' + r + '"') + ":" + h(e, n);
  }
  return "[" + h(e, r) + "]:" + h(e, n);
}
function cr$1(e, t, r) {
  let n = r.k, a = n.length;
  if (a > 0) {
    let o = r.v;
    e.base.stack.push(t.i);
    let i = tt$1(e, t, n[0], o[0]);
    for (let u = 1, c = i; u < a; u++) c = tt$1(e, t, n[u], o[u]), i += (c && i && ",") + c;
    return e.base.stack.pop(), "{" + i + "}";
  }
  return "{}";
}
function wo(e, t) {
  return Ce(e, t.o, t.i), cr$1(e, t, t.p);
}
function vo(e, t, r, n) {
  let a = cr$1(e, t, r);
  return a !== "{}" ? "Object.assign(" + n + "," + a + ")" : n;
}
function So(e, t, r, n, a) {
  let o = e.base, i = h(e, a), u = Number(n), c = u >= 0 && u.toString() === n || ir$1(n);
  if (A$1(o, a)) c && u !== u ? xe$1(e, t.i, n, i) : K(e, t.i, c ? n : '"' + n + '"', i);
  else {
    let l = o.assignments;
    o.assignments = r, c && u !== u ? xe$1(e, t.i, n, i) : K(e, t.i, c ? n : '"' + n + '"', i), o.assignments = l;
  }
}
function Eo(e, t, r, n, a) {
  if (typeof n == "string") So(e, t, r, n, a);
  else {
    let o = e.base, i = o.stack;
    o.stack = [];
    let u = h(e, a);
    o.stack = i;
    let c = o.assignments;
    o.assignments = r, K(e, t.i, h(e, n), u), o.assignments = c;
  }
}
function Ro(e, t, r) {
  let n = r.k, a = n.length;
  if (a > 0) {
    let o = [], i = r.v;
    e.base.stack.push(t.i);
    for (let u = 0; u < a; u++) Eo(e, t, o, n[u], i[u]);
    return e.base.stack.pop(), ur$1(o);
  }
  return s;
}
function Oe$1(e, t, r) {
  if (t.p) {
    let n = e.base;
    if (n.features & 8) r = vo(e, t, t.p, r);
    else {
      E$1(n, t.i);
      let a = Ro(e, t, t.p);
      if (a) return "(" + W$1(e, t.i, r) + "," + a + m$2(e, t.i) + ")";
    }
  }
  return r;
}
function xo(e, t) {
  return Ce(e, t.o, t.i), Oe$1(e, t, to);
}
function Ao(e) {
  return 'new Date("' + e.s + '")';
}
function ko(e, t) {
  if (e.base.features & 32) return "/" + t.c + "/" + t.m;
  throw new U$2(t);
}
function rt(e, t, r) {
  let n = e.base;
  return A$1(n, r) ? (E$1(n, t), go(e, t, m$2(e, r.i)), "") : h(e, r);
}
function _o(e, t) {
  let r = ro, n = t.a, a = n.length, o = t.i;
  if (a > 0) {
    e.base.stack.push(o);
    let i = rt(e, o, n[0]);
    for (let u = 1, c = i; u < a; u++) c = rt(e, o, n[u]), i += (c && i && ",") + c;
    e.base.stack.pop(), i && (r += "([" + i + "])");
  }
  return r;
}
function nt$1(e, t, r, n, a) {
  let o = e.base;
  if (A$1(o, r)) {
    let i = m$2(e, r.i);
    if (E$1(o, t), A$1(o, n)) {
      let c = m$2(e, n.i);
      return X$1(e, t, i, c), "";
    }
    if (n.t !== 4 && n.i != null && Re$1(o, n.i)) {
      let c = "(" + h(e, n) + ",[" + a + "," + a + "])";
      return X$1(e, t, i, m$2(e, n.i)), Ze$1(e, t, a), c;
    }
    let u = o.stack;
    return o.stack = [], X$1(e, t, i, h(e, n)), o.stack = u, "";
  }
  if (A$1(o, n)) {
    let i = m$2(e, n.i);
    if (E$1(o, t), r.t !== 4 && r.i != null && Re$1(o, r.i)) {
      let c = "(" + h(e, r) + ",[" + a + "," + a + "])";
      return X$1(e, t, m$2(e, r.i), i), Ze$1(e, t, a), c;
    }
    let u = o.stack;
    return o.stack = [], X$1(e, t, h(e, r), i), o.stack = u, "";
  }
  return "[" + h(e, r) + "," + h(e, n) + "]";
}
function $o(e, t) {
  let r = no, n = t.e.k, a = n.length, o = t.i, i = t.f, u = m$2(e, i.i), c = e.base;
  if (a > 0) {
    let l = t.e.v;
    c.stack.push(o);
    let p = nt$1(e, o, n[0], l[0], u);
    for (let d = 1, w = p; d < a; d++) w = nt$1(e, o, n[d], l[d], u), p += (w && p && ",") + w;
    c.stack.pop(), p && (r += "([" + p + "])");
  }
  return i.t === 26 && (E$1(c, i.i), r = "(" + h(e, i) + "," + r + ")"), r;
}
function zo(e, t) {
  return D$1(e, t.f) + '("' + t.s + '")';
}
function Co(e, t) {
  return "new " + t.c + "(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Po(e, t) {
  return "new DataView(" + h(e, t.f) + "," + t.b + "," + t.l + ")";
}
function Oo(e, t) {
  let r = t.i;
  e.base.stack.push(r);
  let n = Oe$1(e, t, 'new AggregateError([],"' + t.m + '")');
  return e.base.stack.pop(), n;
}
function Io(e, t) {
  return Oe$1(e, t, "new " + It$1[t.s] + '("' + t.m + '")');
}
function Lo(e, t) {
  let r, n = t.f, a = t.i, o = t.s ? so : ao, i = e.base;
  if (A$1(i, n)) {
    let u = m$2(e, n.i);
    r = o + (t.s ? "().then(" + sr$1([], u) + ")" : "().catch(" + Ka([], "throw " + u) + ")");
  } else {
    i.stack.push(a);
    let u = h(e, n);
    i.stack.pop(), r = o + "(" + u + ")";
  }
  return r;
}
function To(e, t) {
  return "Object(" + h(e, t.f) + ")";
}
function D$1(e, t) {
  let r = h(e, t);
  return t.t === 4 ? r : "(" + r + ")";
}
function No(e, t) {
  if (e.mode === 1) throw new U$2(t);
  return "(" + W$1(e, t.s, D$1(e, t.f) + "()") + ").p";
}
function Uo(e, t) {
  if (e.mode === 1) throw new U$2(t);
  return D$1(e, t.a[0]) + "(" + m$2(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function Fo(e, t) {
  if (e.mode === 1) throw new U$2(t);
  return D$1(e, t.a[0]) + "(" + m$2(e, t.i) + "," + h(e, t.a[1]) + ")";
}
function Do(e, t) {
  let r = e.base.plugins;
  if (r) for (let n = 0, a = r.length; n < a; n++) {
    let o = r[n];
    if (o.tag === t.c) return e.child == null && (e.child = new co(e)), o.serialize(t.s, e.child, { id: t.i });
  }
  throw new Mt$1(t.c);
}
function qo(e, t) {
  let r = "", n = false;
  return t.f.t !== 4 && (E$1(e.base, t.f.i), r = "(" + h(e, t.f) + ",", n = true), r += W$1(e, t.i, "(" + Fs + ")(" + m$2(e, t.f.i) + ")"), n && (r += ")"), r;
}
function jo(e, t) {
  return D$1(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function Ho(e, t) {
  let r = t.a[0], n = t.a[1], a = e.base, o = "";
  r.t !== 4 && (E$1(a, r.i), o += "(" + h(e, r)), n.t !== 4 && (E$1(a, n.i), o += (o ? "," : "(") + h(e, n)), o && (o += ",");
  let i = W$1(e, t.i, "(" + Ds + ")(" + m$2(e, n.i) + "," + m$2(e, r.i) + ")");
  return o ? o + i + ")" : i;
}
function Mo(e, t) {
  return D$1(e, t.a[0]) + "(" + h(e, t.a[1]) + ")";
}
function Bo(e, t) {
  let r = W$1(e, t.i, D$1(e, t.f) + "()"), n = t.a.length;
  if (n) {
    let a = h(e, t.a[0]);
    for (let o = 1; o < n; o++) a += "," + h(e, t.a[o]);
    return "(" + r + "," + a + "," + m$2(e, t.i) + ")";
  }
  return r;
}
function Vo(e, t) {
  return m$2(e, t.i) + ".next(" + h(e, t.f) + ")";
}
function Wo(e, t) {
  return m$2(e, t.i) + ".throw(" + h(e, t.f) + ")";
}
function Xo(e, t) {
  return m$2(e, t.i) + ".return(" + h(e, t.f) + ")";
}
function st$1(e, t, r, n) {
  let a = e.base;
  return A$1(a, n) ? (E$1(a, t), mo(e, t, r, m$2(e, n.i)), "") : h(e, n);
}
function Go(e, t) {
  let r = t.a, n = r.length, a = t.i;
  if (n > 0) {
    e.base.stack.push(a);
    let o = st$1(e, a, 0, r[0]);
    for (let i = 1, u = o; i < n; i++) u = st$1(e, a, i, r[i]), o += (u && o && ",") + u;
    if (e.base.stack.pop(), o) return "{__SEROVAL_SEQUENCE__:!0,v:[" + o + "],t:" + t.s + ",d:" + t.l + "}";
  }
  return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function Jo(e, t) {
  switch (t.t) {
    case 17:
      return Fn[t.s];
    case 18:
      return bo(t);
    case 9:
      return yo(e, t);
    case 10:
      return wo(e, t);
    case 11:
      return xo(e, t);
    case 5:
      return Ao(t);
    case 6:
      return ko(e, t);
    case 7:
      return _o(e, t);
    case 8:
      return $o(e, t);
    case 19:
      return zo(e, t);
    case 16:
    case 15:
      return Co(e, t);
    case 20:
      return Po(e, t);
    case 14:
      return Oo(e, t);
    case 13:
      return Io(e, t);
    case 12:
      return Lo(e, t);
    case 21:
      return To(e, t);
    case 22:
      return No(e, t);
    case 25:
      return Do(e, t);
    case 26:
      return Gs[t.s];
    case 35:
      return Go(e, t);
    default:
      throw new U$2(t);
  }
}
function h(e, t) {
  switch (t.t) {
    case 2:
      return qn[t.s];
    case 0:
      return "" + t.s;
    case 1:
      return '"' + t.s + '"';
    case 3:
      return t.s + "n";
    case 4:
      return m$2(e, t.i);
    case 23:
      return Uo(e, t);
    case 24:
      return Fo(e, t);
    case 27:
      return qo(e, t);
    case 28:
      return jo(e, t);
    case 29:
      return Ho(e, t);
    case 30:
      return Mo(e, t);
    case 31:
      return Bo(e, t);
    case 32:
      return Vo(e, t);
    case 33:
      return Wo(e, t);
    case 34:
      return Xo(e, t);
    default:
      return W$1(e, t.i, Jo(e, t));
  }
}
function Yo(e, t) {
  let r = h(e, t), n = t.i;
  if (n == null) return r;
  let a = ho(e.base), o = m$2(e, n), i = e.state.scopeId, u = i == null ? "" : ue$1, c = a ? "(" + r + "," + a + o + ")" : r;
  if (u === "") return t.t === 10 && !a ? "(" + c + ")" : c;
  let l = i == null ? "()" : "(" + ue$1 + '["' + x$2(i) + '"])';
  return "(" + sr$1([u], c) + ")" + l;
}
var Ko = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return v$1(this._p, this.depth, e);
  }
}, Qo = class {
  constructor(e, t) {
    this._p = e, this.depth = t;
  }
  parse(e) {
    return v$1(this._p, this.depth, e);
  }
  parseWithError(e) {
    return N$2(this._p, this.depth, e);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    Ne$1(this._p);
  }
  popPendingState() {
    Q$1(this._p);
  }
  onParse(e) {
    V$1(this._p, e);
  }
  onError(e) {
    Le$1(this._p, e);
  }
};
function Zo(e) {
  return { alive: true, pending: 0, initial: true, buffer: [], onParse: e.onParse, onError: e.onError, onDone: e.onDone };
}
function lr$1(e) {
  return { type: 2, base: Zs(2, e), state: Zo(e) };
}
function ei(e, t, r) {
  let n = [];
  for (let a = 0, o = r.length; a < o; a++) a in r ? n[a] = v$1(e, t, r[a]) : n[a] = 0;
  return n;
}
function ti(e, t, r, n) {
  return cs(r, n, ei(e, t, n));
}
function Ie$1(e, t, r) {
  let n = Object.entries(r), a = [], o = [];
  for (let i = 0, u = n.length; i < u; i++) a.push(x$2(n[i][0])), o.push(v$1(e, t, n[i][1]));
  return _ in r && (a.push(L(e.base, _)), o.push(bs(ta(e.base), v$1(e, t, Hs(r))))), k$2 in r && (a.push(L(e.base, k$2)), o.push(ys(ra(e.base), v$1(e, t, e.type === 1 ? ee$2() : Ys(r))))), B$1 in r && (a.push(L(e.base, B$1)), o.push(qt$1(r[B$1]))), M$2 in r && (a.push(L(e.base, M$2)), o.push(r[M$2] ? Lt$1 : Tt$1)), { k: a, v: o };
}
function ge$1(e, t, r, n, a) {
  return na(r, n, a, Ie$1(e, t, n));
}
function ri(e, t, r, n) {
  return ls(r, v$1(e, t, n.valueOf()));
}
function ni(e, t, r, n) {
  return fs(r, n, v$1(e, t, n.buffer));
}
function si(e, t, r, n) {
  return ps(r, n, v$1(e, t, n.buffer));
}
function ai(e, t, r, n) {
  return ds(r, n, v$1(e, t, n.buffer));
}
function at$1(e, t, r, n) {
  let a = Ft$1(n, e.base.features);
  return hs(r, n, a ? Ie$1(e, t, a) : s);
}
function oi(e, t, r, n) {
  let a = Ft$1(n, e.base.features);
  return gs(r, n, a ? Ie$1(e, t, a) : s);
}
function ii(e, t, r, n) {
  let a = [], o = [];
  for (let [i, u] of n.entries()) a.push(v$1(e, t, i)), o.push(v$1(e, t, u));
  return sa(e.base, r, a, o);
}
function ui(e, t, r, n) {
  let a = [];
  for (let o of n.keys()) a.push(v$1(e, t, o));
  return ms(r, a);
}
function ci(e, t, r, n) {
  let a = ws(r, F$2(e.base, 4), []);
  return e.type === 1 || (Ne$1(e), n.on({ next: (o) => {
    if (e.state.alive) {
      let i = N$2(e, t, o);
      i && V$1(e, vs(r, i));
    }
  }, throw: (o) => {
    if (e.state.alive) {
      let i = N$2(e, t, o);
      i && V$1(e, Ss(r, i));
    }
    Q$1(e);
  }, return: (o) => {
    if (e.state.alive) {
      let i = N$2(e, t, o);
      i && V$1(e, Es(r, i));
    }
    Q$1(e);
  } })), a;
}
function li(e, t, r) {
  if (this.state.alive) {
    let n = N$2(this, t, r);
    n && V$1(this, g$2(23, e, s, s, s, s, s, [F$2(this.base, 2), n], s, s, s, s)), Q$1(this);
  }
}
function fi(e, t, r) {
  if (this.state.alive) {
    let n = N$2(this, t, r);
    n && V$1(this, g$2(24, e, s, s, s, s, s, [F$2(this.base, 3), n], s, s, s, s));
  }
  Q$1(this);
}
function pi(e, t, r, n) {
  let a = Yt$1(e.base, {});
  return e.type === 2 && (Ne$1(e), n.then(li.bind(e, a, t), fi.bind(e, a, t))), aa(e.base, r, a);
}
function di(e, t, r, n, a) {
  for (let o = 0, i = a.length; o < i; o++) {
    let u = a[o];
    if (u.parse.sync && u.test(n)) return jt$1(r, u.tag, u.parse.sync(n, new Ko(e, t), { id: r }));
  }
  return s;
}
function hi(e, t, r, n, a) {
  for (let o = 0, i = a.length; o < i; o++) {
    let u = a[o];
    if (u.parse.stream && u.test(n)) return jt$1(r, u.tag, u.parse.stream(n, new Qo(e, t), { id: r }));
  }
  return s;
}
function fr$1(e, t, r, n) {
  let a = e.base.plugins;
  return a ? e.type === 1 ? di(e, t, r, n, a) : hi(e, t, r, n, a) : s;
}
function gi(e, t, r, n) {
  let a = [];
  for (let o = 0, i = n.v.length; o < i; o++) a[o] = v$1(e, t, n.v[o]);
  return Rs(r, a, n.t, n.d);
}
function mi(e, t, r, n, a) {
  switch (a) {
    case Object:
      return ge$1(e, t, r, n, false);
    case s:
      return ge$1(e, t, r, n, true);
    case Date:
      return as(r, n);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return at$1(e, t, r, n);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return ri(e, t, r, n);
    case ArrayBuffer:
      return oa(e.base, r, n);
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return ni(e, t, r, n);
    case DataView:
      return ai(e, t, r, n);
    case Map:
      return ii(e, t, r, n);
    case Set:
      return ui(e, t, r, n);
  }
  if (a === Promise || n instanceof Promise) return pi(e, t, r, n);
  let o = e.base.features;
  if (o & 32 && a === RegExp) return os(r, n);
  if (o & 16) switch (a) {
    case BigInt64Array:
    case BigUint64Array:
      return si(e, t, r, n);
  }
  if (o & 1 && typeof AggregateError < "u" && (a === AggregateError || n instanceof AggregateError)) return oi(e, t, r, n);
  if (n instanceof Error) return at$1(e, t, r, n);
  if (_ in n || k$2 in n) return ge$1(e, t, r, n, !!a);
  throw new ce$2(n);
}
function bi(e, t, r, n) {
  if (Array.isArray(n)) return ti(e, t, r, n);
  if (Js(n)) return ci(e, t, r, n);
  if (js(n)) return gi(e, t, r, n);
  let a = n.constructor;
  return a === Ps ? v$1(e, t, n.replacement) : fr$1(e, t, r, n) || mi(e, t, r, n, a);
}
function yi(e, t, r) {
  let n = $e$1(e.base, r);
  if (n.type !== 0) return n.value;
  let a = fr$1(e, t, n.value, r);
  if (a) return a;
  throw new ce$2(r);
}
function v$1(e, t, r) {
  if (t >= e.base.depthLimit) throw new Bt$1(e.base.depthLimit);
  switch (typeof r) {
    case "boolean":
      return r ? Lt$1 : Tt$1;
    case "undefined":
      return Mn;
    case "string":
      return qt$1(r);
    case "number":
      return rs(r);
    case "bigint":
      return ns(r);
    case "object": {
      if (r) {
        let n = $e$1(e.base, r);
        return n.type === 0 ? bi(e, t + 1, n.value, r) : n.value;
      }
      return Bn;
    }
    case "symbol":
      return L(e.base, r);
    case "function":
      return yi(e, t, r);
    default:
      throw new ce$2(r);
  }
}
function V$1(e, t) {
  e.state.initial ? e.state.buffer.push(t) : Te$1(e, t, false);
}
function Le$1(e, t) {
  if (e.state.onError) e.state.onError(t);
  else throw t instanceof Je$1 ? t : new Je$1(t);
}
function pr$1(e) {
  e.state.onDone && e.state.onDone();
}
function Te$1(e, t, r) {
  try {
    e.state.onParse(t, r);
  } catch (n) {
    Le$1(e, n);
  }
}
function Ne$1(e) {
  e.state.pending++;
}
function Q$1(e) {
  --e.state.pending <= 0 && pr$1(e);
}
function N$2(e, t, r) {
  try {
    return v$1(e, t, r);
  } catch (n) {
    return Le$1(e, n), s;
  }
}
function dr$1(e, t) {
  let r = N$2(e, 0, t);
  r && (Te$1(e, r, true), e.state.initial = false, wi(e, e.state), e.state.pending <= 0 && Ue$1(e));
}
function wi(e, t) {
  for (let r = 0, n = t.buffer.length; r < n; r++) Te$1(e, t.buffer[r], false);
}
function Ue$1(e) {
  e.state.alive && (pr$1(e), e.state.alive = false);
}
function vi(e, t) {
  let r = ze$1(t.plugins), n = lr$1({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, onParse(a, o) {
    let i = uo({ plugins: r, features: n.base.features, scopeId: t.scopeId, markedRefs: n.base.marked }), u;
    try {
      u = Yo(i, a);
    } catch (c) {
      t.onError && t.onError(c);
      return;
    }
    t.onSerialize(u, o);
  }, onError: t.onError, onDone: t.onDone });
  return dr$1(n, e), Ue$1.bind(null, n);
}
function Si(e, t) {
  let r = ze$1(t.plugins), n = lr$1({ plugins: r, refs: t.refs, disabledFeatures: t.disabledFeatures, depthLimit: t.depthLimit, onParse: t.onParse, onError: t.onError, onDone: t.onDone });
  return dr$1(n, e), Ue$1.bind(null, n);
}
function Ei(e, t = {}) {
  var r;
  let n = ze$1(t.plugins), a = t.disabledFeatures || 0, o = (r = e.f) != null ? r : 63, i = ha({ plugins: n, markedRefs: e.m, features: o & ~a, disabledFeatures: a });
  return Ga(i, e.t);
}
var Ae$1 = (e) => {
  let t = new AbortController(), r = t.abort.bind(t);
  return e.then(r, r), t;
};
function Ri(e) {
  e(this.reason);
}
function xi(e) {
  this.addEventListener("abort", Ri.bind(this, e), { once: true });
}
function ot(e) {
  return new Promise(xi.bind(e));
}
var Y$1 = {}, Ai = { tag: "seroval-plugins/web/AbortControllerFactoryPlugin", test(e) {
  return e === Y$1;
}, parse: { sync() {
  return Y$1;
}, async async() {
  return await Promise.resolve(Y$1);
}, stream() {
  return Y$1;
} }, serialize() {
  return Ae$1.toString();
}, deserialize() {
  return Ae$1;
} }, ki = { tag: "seroval-plugins/web/AbortSignal", extends: [Ai], test(e) {
  return typeof AbortSignal > "u" ? false : e instanceof AbortSignal;
}, parse: { sync(e, t) {
  return e.aborted ? { reason: t.parse(e.reason) } : {};
}, async async(e, t) {
  if (e.aborted) return { reason: await t.parse(e.reason) };
  let r = await ot(e);
  return { reason: await t.parse(r) };
}, stream(e, t) {
  if (e.aborted) return { reason: t.parse(e.reason) };
  let r = ot(e);
  return { factory: t.parse(Y$1), controller: t.parse(r) };
} }, serialize(e, t) {
  return e.reason ? "AbortSignal.abort(" + t.serialize(e.reason) + ")" : e.controller && e.factory ? "(" + t.serialize(e.factory) + ")(" + t.serialize(e.controller) + ").signal" : "(new AbortController).signal";
}, deserialize(e, t) {
  return e.reason ? AbortSignal.abort(t.deserialize(e.reason)) : e.controller ? Ae$1(t.deserialize(e.controller)).signal : new AbortController().signal;
} }, _i = ki;
function me$1(e) {
  return { detail: e.detail, bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var $i = { tag: "seroval-plugins/web/CustomEvent", test(e) {
  return typeof CustomEvent > "u" ? false : e instanceof CustomEvent;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(me$1(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(me$1(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(me$1(e)) };
} }, serialize(e, t) {
  return "new CustomEvent(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new CustomEvent(t.deserialize(e.type), t.deserialize(e.options));
} }, zi = $i, Ci = { tag: "seroval-plugins/web/DOMException", test(e) {
  return typeof DOMException > "u" ? false : e instanceof DOMException;
}, parse: { sync(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
}, async async(e, t) {
  return { name: await t.parse(e.name), message: await t.parse(e.message) };
}, stream(e, t) {
  return { name: t.parse(e.name), message: t.parse(e.message) };
} }, serialize(e, t) {
  return "new DOMException(" + t.serialize(e.message) + "," + t.serialize(e.name) + ")";
}, deserialize(e, t) {
  return new DOMException(t.deserialize(e.message), t.deserialize(e.name));
} }, Pi = Ci;
function be$1(e) {
  return { bubbles: e.bubbles, cancelable: e.cancelable, composed: e.composed };
}
var Oi = { tag: "seroval-plugins/web/Event", test(e) {
  return typeof Event > "u" ? false : e instanceof Event;
}, parse: { sync(e, t) {
  return { type: t.parse(e.type), options: t.parse(be$1(e)) };
}, async async(e, t) {
  return { type: await t.parse(e.type), options: await t.parse(be$1(e)) };
}, stream(e, t) {
  return { type: t.parse(e.type), options: t.parse(be$1(e)) };
} }, serialize(e, t) {
  return "new Event(" + t.serialize(e.type) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Event(t.deserialize(e.type), t.deserialize(e.options));
} }, Ii = Oi, Li = { tag: "seroval-plugins/web/File", test(e) {
  return typeof File > "u" ? false : e instanceof File;
}, parse: { async async(e, t) {
  return { name: await t.parse(e.name), options: await t.parse({ type: e.type, lastModified: e.lastModified }), buffer: await t.parse(await e.arrayBuffer()) };
} }, serialize(e, t) {
  return "new File([" + t.serialize(e.buffer) + "]," + t.serialize(e.name) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new File([t.deserialize(e.buffer)], t.deserialize(e.name), t.deserialize(e.options));
} }, Ti = Li;
function ye$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var C$2 = {}, hr$1 = (e, t = new FormData(), r = 0, n = e.length, a) => {
  for (; r < n; r++) a = e[r], t.append(a[0], a[1]);
  return t;
}, Ni = { tag: "seroval-plugins/web/FormDataFactory", test(e) {
  return e === C$2;
}, parse: { sync() {
  return C$2;
}, async async() {
  return await Promise.resolve(C$2);
}, stream() {
  return C$2;
} }, serialize() {
  return hr$1.toString();
}, deserialize() {
  return C$2;
} }, Ui = { tag: "seroval-plugins/web/FormData", extends: [Ti, Ni], test(e) {
  return typeof FormData > "u" ? false : e instanceof FormData;
}, parse: { sync(e, t) {
  return { factory: t.parse(C$2), entries: t.parse(ye$1(e)) };
}, async async(e, t) {
  return { factory: await t.parse(C$2), entries: await t.parse(ye$1(e)) };
}, stream(e, t) {
  return { factory: t.parse(C$2), entries: t.parse(ye$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.entries) + ")";
}, deserialize(e, t) {
  return hr$1(t.deserialize(e.entries));
} }, Fi = Ui;
function we$1(e) {
  let t = [];
  return e.forEach((r, n) => {
    t.push([n, r]);
  }), t;
}
var Di = { tag: "seroval-plugins/web/Headers", test(e) {
  return typeof Headers > "u" ? false : e instanceof Headers;
}, parse: { sync(e, t) {
  return { value: t.parse(we$1(e)) };
}, async async(e, t) {
  return { value: await t.parse(we$1(e)) };
}, stream(e, t) {
  return { value: t.parse(we$1(e)) };
} }, serialize(e, t) {
  return "new Headers(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new Headers(t.deserialize(e.value));
} }, Fe$1 = Di, P = {}, gr$1 = (e) => new ReadableStream({ start: (t) => {
  e.on({ next: (r) => {
    try {
      t.enqueue(r);
    } catch {
    }
  }, throw: (r) => {
    t.error(r);
  }, return: () => {
    try {
      t.close();
    } catch {
    }
  } });
} }), qi = { tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === P;
}, parse: { sync() {
  return P;
}, async async() {
  return await Promise.resolve(P);
}, stream() {
  return P;
} }, serialize() {
  return gr$1.toString();
}, deserialize() {
  return P;
} };
function it$1(e) {
  let t = ee$2(), r = e.getReader();
  async function n() {
    try {
      let a = await r.read();
      a.done ? t.return(a.value) : (t.next(a.value), await n());
    } catch (a) {
      t.throw(a);
    }
  }
  return n().catch(() => {
  }), t;
}
var ji = { tag: "seroval/plugins/web/ReadableStream", extends: [qi], test(e) {
  return typeof ReadableStream > "u" ? false : e instanceof ReadableStream;
}, parse: { sync(e, t) {
  return { factory: t.parse(P), stream: t.parse(ee$2()) };
}, async async(e, t) {
  return { factory: await t.parse(P), stream: await t.parse(it$1(e)) };
}, stream(e, t) {
  return { factory: t.parse(P), stream: t.parse(it$1(e)) };
} }, serialize(e, t) {
  return "(" + t.serialize(e.factory) + ")(" + t.serialize(e.stream) + ")";
}, deserialize(e, t) {
  let r = t.deserialize(e.stream);
  return gr$1(r);
} }, De$1 = ji;
function ut$1(e, t) {
  return { body: t, cache: e.cache, credentials: e.credentials, headers: e.headers, integrity: e.integrity, keepalive: e.keepalive, method: e.method, mode: e.mode, redirect: e.redirect, referrer: e.referrer, referrerPolicy: e.referrerPolicy };
}
var Hi = { tag: "seroval-plugins/web/Request", extends: [De$1, Fe$1], test(e) {
  return typeof Request > "u" ? false : e instanceof Request;
}, parse: { async async(e, t) {
  return { url: await t.parse(e.url), options: await t.parse(ut$1(e, e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null)) };
}, stream(e, t) {
  return { url: t.parse(e.url), options: t.parse(ut$1(e, e.body && !e.bodyUsed ? e.clone().body : null)) };
} }, serialize(e, t) {
  return "new Request(" + t.serialize(e.url) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Request(t.deserialize(e.url), t.deserialize(e.options));
} }, Mi = Hi;
function ct$1(e) {
  return { headers: e.headers, status: e.status, statusText: e.statusText };
}
var Bi = { tag: "seroval-plugins/web/Response", extends: [De$1, Fe$1], test(e) {
  return typeof Response > "u" ? false : e instanceof Response;
}, parse: { async async(e, t) {
  return { body: await t.parse(e.body && !e.bodyUsed ? await e.clone().arrayBuffer() : null), options: await t.parse(ct$1(e)) };
}, stream(e, t) {
  return { body: t.parse(e.body && !e.bodyUsed ? e.clone().body : null), options: t.parse(ct$1(e)) };
} }, serialize(e, t) {
  return "new Response(" + t.serialize(e.body) + "," + t.serialize(e.options) + ")";
}, deserialize(e, t) {
  return new Response(t.deserialize(e.body), t.deserialize(e.options));
} }, Vi = Bi, Wi = { tag: "seroval-plugins/web/URL", test(e) {
  return typeof URL > "u" ? false : e instanceof URL;
}, parse: { sync(e, t) {
  return { value: t.parse(e.href) };
}, async async(e, t) {
  return { value: await t.parse(e.href) };
}, stream(e, t) {
  return { value: t.parse(e.href) };
} }, serialize(e, t) {
  return "new URL(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new URL(t.deserialize(e.value));
} }, Xi = Wi, Gi = { tag: "seroval-plugins/web/URLSearchParams", test(e) {
  return typeof URLSearchParams > "u" ? false : e instanceof URLSearchParams;
}, parse: { sync(e, t) {
  return { value: t.parse(e.toString()) };
}, async async(e, t) {
  return { value: await t.parse(e.toString()) };
}, stream(e, t) {
  return { value: t.parse(e.toString()) };
} }, serialize(e, t) {
  return "new URLSearchParams(" + t.serialize(e.value) + ")";
}, deserialize(e, t) {
  return new URLSearchParams(t.deserialize(e.value));
} }, Ji = Gi;
const qe$1 = [_i, zi, Pi, Ii, Fi, Fe$1, De$1, Mi, Vi, Ji, Xi], Yi = 64, mr$1 = Et$1.RegExp;
function br$1(e) {
  const t = new TextEncoder().encode(e), r = t.length, n = r.toString(16), a = "00000000".substring(0, 8 - n.length) + n, o = new TextEncoder().encode(`;0x${a};`), i = new Uint8Array(12 + r);
  return i.set(o), i.set(t, 12), i;
}
function lt$1(e, t) {
  return new ReadableStream({ start(r) {
    vi(t, { scopeId: e, plugins: qe$1, onSerialize(n, a) {
      r.enqueue(br$1(a ? `(${Kn(e)},${n})` : n));
    }, onDone() {
      r.close();
    }, onError(n) {
      r.error(n);
    } });
  } });
}
function Ki(e) {
  return new ReadableStream({ start(t) {
    Si(e, { disabledFeatures: mr$1, depthLimit: Yi, plugins: qe$1, onParse(r) {
      t.enqueue(br$1(JSON.stringify(r)));
    }, onDone() {
      t.close();
    }, onError(r) {
      t.error(r);
    } });
  } });
}
async function ft$1(e) {
  return Ei(JSON.parse(e), { plugins: qe$1, disabledFeatures: mr$1 });
}
async function Qi(e) {
  const t = yn(e), r = t.request, n = r.headers.get("X-Server-Id"), a = r.headers.get("X-Server-Instance"), o = r.headers.has("X-Single-Flight"), i = new URL(r.url);
  let u, c;
  if (n) gn(typeof n == "string", "Invalid server function"), [u, c] = decodeURIComponent(n).split("#");
  else if (u = i.searchParams.get("id"), c = i.searchParams.get("name"), !u || !c) return new Response(null, { status: 404 });
  const l = Un[u];
  let p;
  if (!l) return new Response(null, { status: 404 });
  p = await l.importer();
  const d = p[l.functionName];
  let w = [];
  if (!a || e.method === "GET") {
    const f = i.searchParams.get("args");
    if (f) {
      const R = await ft$1(f);
      for (const re of R) w.push(re);
    }
  }
  if (e.method === "POST") {
    const f = r.headers.get("content-type"), R = e.node.req, re = R instanceof ReadableStream, yr = R.body instanceof ReadableStream, wr = re && R.locked || yr && R.body.locked, vr = re ? R : R.body, pe = wr ? r : new Request(r, { ...r, body: vr });
    r.headers.get("x-serialized") ? w = await ft$1(await pe.text()) : (f == null ? void 0 : f.startsWith("multipart/form-data")) || (f == null ? void 0 : f.startsWith("application/x-www-form-urlencoded")) ? w.push(await pe.formData()) : (f == null ? void 0 : f.startsWith("application/json")) && (w = await pe.json());
  }
  try {
    let f = await provideRequestEvent(t, async () => (sharedConfig.context = { event: t }, t.locals.serverFunctionMeta = { id: u + "#" + c }, d(...w)));
    if (o && a && (f = await dt$1(t, f)), f instanceof Response) {
      if (f.headers && f.headers.has("X-Content-Raw")) return f;
      a && (f.headers && We$1(e, f.headers), f.status && (f.status < 300 || f.status >= 400) && ie$2(e, f.status), f.customBody ? f = await f.customBody() : f.body == null && (f = null));
    }
    if (!a) return pt$1(f, r, w);
    return q$2(e, "x-serialized", "true"), q$2(e, "content-type", "text/javascript"), lt$1(a, f);
    return Ki(f);
  } catch (f) {
    if (f instanceof Response) o && a && (f = await dt$1(t, f)), f.headers && We$1(e, f.headers), f.status && (!a || f.status < 300 || f.status >= 400) && ie$2(e, f.status), f.customBody ? f = f.customBody() : f.body == null && (f = null), q$2(e, "X-Error", "true");
    else if (a) {
      const R = f instanceof Error ? f.message : typeof f == "string" ? f : "true";
      q$2(e, "X-Error", R.replace(/[\r\n]+/g, ""));
    } else f = pt$1(f, r, w, true);
    return a ? (q$2(e, "x-serialized", "true"), q$2(e, "content-type", "text/javascript"), lt$1(a, f)) : f;
  }
}
function pt$1(e, t, r, n) {
  const a = new URL(t.url), o = e instanceof Error;
  let i = 302, u;
  return e instanceof Response ? (u = new Headers(e.headers), e.headers.has("Location") && (u.set("Location", new URL(e.headers.get("Location"), a.origin + "").toString()), i = Nn(e))) : u = new Headers({ Location: new URL(t.headers.get("referer")).toString() }), e && u.append("Set-Cookie", `flash=${encodeURIComponent(JSON.stringify({ url: a.pathname + a.search, result: o ? e.message : e, thrown: n, error: o, input: [...r.slice(0, -1), [...r[r.length - 1].entries()]] }))}; Secure; HttpOnly;`), new Response(null, { status: i, headers: u });
}
let ve;
function Zi(e) {
  var _a2;
  const t = new Headers(e.request.headers), r = an(e.nativeEvent), n = e.response.headers.getSetCookie();
  t.delete("cookie");
  let a = false;
  return ((_a2 = e.nativeEvent.node) == null ? void 0 : _a2.req) && (a = true, e.nativeEvent.node.req.headers.cookie = ""), n.forEach((o) => {
    if (!o) return;
    const { maxAge: i, expires: u, name: c, value: l } = Wr$1(o);
    if (i != null && i <= 0) {
      delete r[c];
      return;
    }
    if (u != null && u.getTime() <= Date.now()) {
      delete r[c];
      return;
    }
    r[c] = l;
  }), Object.entries(r).forEach(([o, i]) => {
    t.append("cookie", `${o}=${i}`), a && (e.nativeEvent.node.req.headers.cookie += `${o}=${i};`);
  }), t;
}
async function dt$1(e, t) {
  let r, n = new URL(e.request.headers.get("referer")).toString();
  t instanceof Response && (t.headers.has("X-Revalidate") && (r = t.headers.get("X-Revalidate").split(",")), t.headers.has("Location") && (n = new URL(t.headers.get("Location"), new URL(e.request.url).origin + "").toString()));
  const a = bn(e);
  return a.request = new Request(n, { headers: Zi(e) }), await provideRequestEvent(a, async () => {
    await Ln(a), ve || (ve = (await import('./chunks/build/app-jW7-0Y0D.mjs')).default), a.router.dataOnly = r || true, a.router.previousUrl = e.request.headers.get("referer");
    try {
      renderToString(() => {
        sharedConfig.context.event = a, ve();
      });
    } catch (u) {
      console.log(u);
    }
    const o = a.router.data;
    if (!o) return t;
    let i = false;
    for (const u in o) o[u] === void 0 ? delete o[u] : i = true;
    return i && (t instanceof Response ? t.customBody && (o._$value = t.customBody()) : (o._$value = t, t = new Response(null, { status: 200 })), t.customBody = () => o, t.headers.set("X-Single-Flight", "true")), t;
  });
}
const fu = eventHandler(Qi);

const y$2 = createContext$1(), v = ["title", "meta"], p$1 = [], f = ["name", "http-equiv", "content", "charset", "media"].concat(["property"]), l$1 = (r, t) => {
  const e = Object.fromEntries(Object.entries(r.props).filter(([n]) => t.includes(n)).sort());
  return (Object.hasOwn(e, "name") || Object.hasOwn(e, "property")) && (e.name = e.name || e.property, delete e.property), r.tag + JSON.stringify(e);
};
function M$1() {
  if (!sharedConfig.context) {
    const e = document.head.querySelectorAll("[data-sm]");
    Array.prototype.forEach.call(e, (n) => n.parentNode.removeChild(n));
  }
  const r = /* @__PURE__ */ new Map();
  function t(e) {
    if (e.ref) return e.ref;
    let n = document.querySelector(`[data-sm="${e.id}"]`);
    return n ? (n.tagName.toLowerCase() !== e.tag && (n.parentNode && n.parentNode.removeChild(n), n = document.createElement(e.tag)), n.removeAttribute("data-sm")) : n = document.createElement(e.tag), n;
  }
  return { addTag(e) {
    if (v.indexOf(e.tag) !== -1) {
      const i = e.tag === "title" ? p$1 : f, a = l$1(e, i);
      r.has(a) || r.set(a, []);
      let s = r.get(a), u = s.length;
      s = [...s, e], r.set(a, s);
      let c = t(e);
      e.ref = c, spread(c, e.props);
      let d = null;
      for (var n = u - 1; n >= 0; n--) if (s[n] != null) {
        d = s[n];
        break;
      }
      return c.parentNode != document.head && document.head.appendChild(c), d && d.ref && d.ref.parentNode && document.head.removeChild(d.ref), u;
    }
    let o = t(e);
    return e.ref = o, spread(o, e.props), o.parentNode != document.head && document.head.appendChild(o), -1;
  }, removeTag(e, n) {
    const o = e.tag === "title" ? p$1 : f, i = l$1(e, o);
    if (e.ref) {
      const a = r.get(i);
      if (a) {
        if (e.ref.parentNode) {
          e.ref.parentNode.removeChild(e.ref);
          for (let s = n - 1; s >= 0; s--) a[s] != null && document.head.appendChild(a[s].ref);
        }
        a[n] = null, r.set(i, a);
      } else e.ref.parentNode && e.ref.parentNode.removeChild(e.ref);
    }
  } };
}
function w() {
  const r = [];
  return useAssets(() => ssr(S$2(r))), { addTag(t) {
    if (v.indexOf(t.tag) !== -1) {
      const e = t.tag === "title" ? p$1 : f, n = l$1(t, e), o = r.findIndex((i) => i.tag === t.tag && l$1(i, e) === n);
      o !== -1 && r.splice(o, 1);
    }
    return r.push(t), r.length;
  }, removeTag(t, e) {
  } };
}
const I$2 = (r) => {
  const t = isServer ? w() : M$1();
  return createComponent$1(y$2.Provider, { value: t, get children() {
    return r.children;
  } });
}, C$1 = (r, t, e) => (A({ tag: r, props: t, setting: e, id: createUniqueId(), get name() {
  return t.name || t.property;
} }), null);
function A(r) {
  const t = useContext(y$2);
  if (!t) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const e = t.addTag(r);
    onCleanup(() => t.removeTag(r, e));
  });
}
function S$2(r) {
  return r.map((t) => {
    var _a, _b;
    const n = Object.keys(t.props).map((i) => i === "children" ? "" : ` ${i}="${escape(t.props[i], true)}"`).join("");
    let o = t.props.children;
    return Array.isArray(o) && (o = o.join("")), ((_a = t.setting) == null ? void 0 : _a.close) ? `<${t.tag} data-sm="${t.id}"${n}>${((_b = t.setting) == null ? void 0 : _b.escape) ? escape(o) : o || ""}</${t.tag}>` : `<${t.tag} data-sm="${t.id}"${n}/>`;
  }).join("");
}
const k$1 = (r) => C$1("title", r, { escape: true, close: true }), H$1 = (r) => C$1("meta", r);

function Ae() {
  let e = /* @__PURE__ */ new Set();
  function t(n) {
    return e.add(n), () => e.delete(n);
  }
  let o = false;
  function r(n, a) {
    if (o) return !(o = false);
    const s = { to: n, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const i of e) i.listener({ ...s, from: i.location, retry: (d) => {
      d && (o = true), i.navigate(n, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: t, confirm: r };
}
let q$1;
function ae$1() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), q$1 = window.history.state._depth;
}
isServer || ae$1();
function nt(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function at(e, t) {
  let o = false;
  return () => {
    const r = q$1;
    ae$1();
    const n = r == null ? null : q$1 - r;
    if (o) {
      o = false;
      return;
    }
    n && t(n) ? (o = true, window.history.go(-n)) : e();
  };
}
const Te = /^(?:[a-z0-9]+:)?\/\//i, Re = /^\/+|(\/)\/+$/g, Ee = "http://sr";
function E(e, t = false) {
  const o = e.replace(Re, "$1");
  return o ? t || /^[?#]/.test(o) ? o : "/" + o : "";
}
function j$2(e, t, o) {
  if (Te.test(t)) return;
  const r = E(e), n = o && E(o);
  let a = "";
  return !n || t.startsWith("/") ? a = r : n.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? a = r + n : a = n, (a || "/") + E(t, !a);
}
function De(e, t) {
  if (e == null) throw new Error(t);
  return e;
}
function xe(e, t) {
  return E(e).replace(/\/*(\*.*)?$/g, "") + E(t);
}
function se$1(e) {
  const t = {};
  return e.searchParams.forEach((o, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(o) : t[r] = [t[r], o] : t[r] = o;
  }), t;
}
function Oe(e, t, o) {
  const [r, n] = e.split("/*", 2), a = r.split("/").filter(Boolean), s = a.length;
  return (i) => {
    const d = i.split("/").filter(Boolean), f = d.length - s;
    if (f < 0 || f > 0 && n === void 0 && !t) return null;
    const u = { path: s ? "" : "/", params: {} }, m = (h) => o === void 0 ? void 0 : o[h];
    for (let h = 0; h < s; h++) {
      const p = a[h], y = p[0] === ":", k = y ? d[h] : d[h].toLowerCase(), R = y ? p.slice(1) : p.toLowerCase();
      if (y && $(k, m(R))) u.params[R] = k;
      else if (y || !$(k, R)) return null;
      u.path += `/${k}`;
    }
    if (n) {
      const h = f ? d.slice(-f).join("/") : "";
      if ($(h, m(n))) u.params[n] = h;
      else return null;
    }
    return u;
  };
}
function $(e, t) {
  const o = (r) => r === e;
  return t === void 0 ? true : typeof t == "string" ? o(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(o) : t instanceof RegExp ? t.test(e) : false;
}
function Ie(e) {
  const [t, o] = e.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((n, a) => n + (a.startsWith(":") ? 2 : 3), r.length - (o === void 0 ? 0 : 1));
}
function ce$1(e) {
  const t = /* @__PURE__ */ new Map(), o = getOwner();
  return new Proxy({}, { get(r, n) {
    return t.has(n) || runWithOwner(o, () => t.set(n, createMemo(() => e()[n]))), t.get(n)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  }, has(r, n) {
    return n in e();
  } });
}
function Le(e, t) {
  const o = new URLSearchParams(e);
  Object.entries(t).forEach(([n, a]) => {
    a == null || a === "" || a instanceof Array && !a.length ? o.delete(n) : a instanceof Array ? (o.delete(n), a.forEach((s) => {
      o.append(n, String(s));
    })) : o.set(n, String(a));
  });
  const r = o.toString();
  return r ? `?${r}` : "";
}
function ie$1(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let o = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const n = [o, o += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); ) n.push(o += t[1]), r = r.slice(t[0].length);
  return ie$1(r).reduce((a, s) => [...a, ...n.map((i) => i + s)], []);
}
const Ue = 100, Ne = createContext$1(), le = createContext$1(), D = () => De(useContext(Ne), "<A> and 'use' router primitives can be only used inside a Route."), _e = () => useContext(le) || D().base, st = (e) => {
  const t = _e();
  return createMemo(() => t.resolvePath(e()));
}, ct = (e) => {
  const t = D();
  return createMemo(() => {
    const o = e();
    return o !== void 0 ? t.renderPath(o) : o;
  });
}, je = () => D().navigatorFactory(), Be = () => D().location, it = () => D().params, lt = () => {
  const e = Be(), t = je(), o = (r, n) => {
    const a = untrack(() => Le(e.search, r) + e.hash);
    t(a, { scroll: false, resolve: false, ...n });
  };
  return [e.query, o];
};
function $e(e, t = "") {
  const { component: o, preload: r, load: n, children: a, info: s } = e, i = !a || Array.isArray(a) && !a.length, d = { key: e, component: o, preload: r || n, info: s };
  return ue(e.path).reduce((f, u) => {
    for (const m of ie$1(u)) {
      const h = xe(t, m);
      let p = i ? h : h.split("/*", 1)[0];
      p = p.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), f.push({ ...d, originalPath: u, pattern: p, matcher: Oe(p, !i, e.matchFilters) });
    }
    return f;
  }, []);
}
function Fe(e, t = 0) {
  return { routes: e, score: Ie(e[e.length - 1]) * 1e4 - t, matcher(o) {
    const r = [];
    for (let n = e.length - 1; n >= 0; n--) {
      const a = e[n], s = a.matcher(o);
      if (!s) return null;
      r.unshift({ ...s, route: a });
    }
    return r;
  } };
}
function ue(e) {
  return Array.isArray(e) ? e : [e];
}
function qe(e, t = "", o = [], r = []) {
  const n = ue(e);
  for (let a = 0, s = n.length; a < s; a++) {
    const i = n[a];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const d = $e(i, t);
      for (const f of d) {
        o.push(f);
        const u = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !u) qe(i.children, f.pattern, o, r);
        else {
          const m = Fe([...o], r.length);
          r.push(m);
        }
        o.pop();
      }
    }
  }
  return o.length ? r : r.sort((a, s) => s.score - a.score);
}
function F$1(e, t) {
  for (let o = 0, r = e.length; o < r; o++) {
    const n = e[o].matcher(t);
    if (n) return n;
  }
  return [];
}
function Me(e, t, o) {
  const r = new URL(Ee), n = createMemo((u) => {
    const m = e();
    try {
      return new URL(m, r);
    } catch {
      return console.error(`Invalid path ${m}`), u;
    }
  }, r, { equals: (u, m) => u.href === m.href }), a = createMemo(() => n().pathname), s = createMemo(() => n().search, true), i = createMemo(() => n().hash), d = () => "", f = on$1(s, () => se$1(n()));
  return { get pathname() {
    return a();
  }, get search() {
    return s();
  }, get hash() {
    return i();
  }, get state() {
    return t();
  }, get key() {
    return d();
  }, query: o ? o(f) : ce$1(f) };
}
let S$1;
function ut() {
  return S$1;
}
function dt(e, t, o, r = {}) {
  const { signal: [n, a], utils: s = {} } = e, i = s.parsePath || ((c) => c), d = s.renderPath || ((c) => c), f = s.beforeLeave || Ae(), u = j$2("", r.base || "");
  if (u === void 0) throw new Error(`${u} is not a valid base path`);
  u && !n().value && a({ value: u, replace: true, scroll: false });
  const [m, h] = createSignal(false);
  let p;
  const y = (c, l) => {
    l.value === k() && l.state === O() || (p === void 0 && h(true), S$1 = c, p = l, startTransition(() => {
      p === l && (R(p.value), fe(p.state), resetErrorBoundaries(), isServer || J[1]((g) => g.filter((C) => C.pending)));
    }).finally(() => {
      p === l && batch(() => {
        S$1 = void 0, c === "navigate" && ge(p), h(false), p = void 0;
      });
    }));
  }, [k, R] = createSignal(n().value), [O, fe] = createSignal(n().state), I = Me(k, O, s.queryWrapper), L = [], J = createSignal(isServer ? be() : []), V = createMemo(() => typeof r.transformUrl == "function" ? F$1(t(), r.transformUrl(I.pathname)) : F$1(t(), I.pathname)), K = () => {
    const c = V(), l = {};
    for (let g = 0; g < c.length; g++) Object.assign(l, c[g].params);
    return l;
  }, pe = s.paramsWrapper ? s.paramsWrapper(K, t) : ce$1(K), G = { pattern: u, path: () => u, outlet: () => null, resolvePath(c) {
    return j$2(u, c);
  } };
  return createRenderEffect(on$1(n, (c) => y("native", c), { defer: true })), { base: G, location: I, params: pe, isRouting: m, renderPath: d, parsePath: i, navigatorFactory: me, matches: V, beforeLeave: f, preloadRoute: ye, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: J };
  function he(c, l, g) {
    untrack(() => {
      if (typeof l == "number") {
        l && (s.go ? s.go(l) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const C = !l || l[0] === "?", { replace: U, resolve: w, scroll: N, state: P } = { replace: false, resolve: !C, scroll: true, ...g }, A = w ? c.resolvePath(l) : j$2(C && I.pathname || "", l);
      if (A === void 0) throw new Error(`Path '${l}' is not a routable path`);
      if (L.length >= Ue) throw new Error("Too many redirects");
      const Q = k();
      if (A !== Q || P !== O()) if (isServer) {
        const X = getRequestEvent();
        X && (X.response = { status: 302, headers: new Headers({ Location: A }) }), a({ value: A, replace: U, scroll: N, state: P });
      } else f.confirm(A, g) && (L.push({ value: Q, replace: U, scroll: N, state: O() }), y("navigate", { value: A, state: P }));
    });
  }
  function me(c) {
    return c = c || useContext(le) || G, (l, g) => he(c, l, g);
  }
  function ge(c) {
    const l = L[0];
    l && (a({ ...c, replace: l.replace, scroll: l.scroll }), L.length = 0);
  }
  function ye(c, l) {
    const g = F$1(t(), c.pathname), C = S$1;
    S$1 = "preload";
    for (let U in g) {
      const { route: w, params: N } = g[U];
      w.component && w.component.preload && w.component.preload();
      const { preload: P } = w;
      l && P && runWithOwner(o(), () => P({ params: N, location: { pathname: c.pathname, search: c.search, hash: c.hash, query: se$1(c), state: null, key: "" }, intent: "preload" }));
    }
    S$1 = C;
  }
  function be() {
    const c = getRequestEvent();
    return c && c.router && c.router.submission ? [c.router.submission] : [];
  }
}
function ft(e, t, o, r) {
  const { base: n, location: a, params: s } = e, { pattern: i, component: d, preload: f } = r().route, u = createMemo(() => r().path);
  d && d.preload && d.preload();
  const m = f ? f({ params: s, location: a, intent: S$1 || "initial" }) : void 0;
  return { parent: t, pattern: i, path: u, outlet: () => d ? createComponent(d, { params: s, location: a, data: m, get children() {
    return o();
  } }) : o(), resolvePath(p) {
    return j$2(n.path(), p, u());
  } };
}
const ze = "https://ssgloghr.com/auth", x$1 = "ssgl_access_tkn", z = "auth_user";
function W(e) {
  if (typeof document > "u") return null;
  const t = decodeURIComponent(document.cookie);
  for (const o of t.split("; ")) if (o.startsWith(e + "=")) return o.substring(e.length + 1);
  return null;
}
function We(e, t, o = 365) {
  if (typeof document > "u") return;
  const r = new Date(Date.now() + o * 24 * 60 * 60 * 1e3), n = typeof location < "u" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${e}=${t}; expires=${r.toUTCString()}; path=/; SameSite=Lax${n}`;
}
function He(e) {
  typeof document > "u" || (document.cookie = `${e}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
}
function Ye() {
  if (typeof localStorage > "u") return null;
  try {
    const e = localStorage.getItem(z);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
const [ee$1, H] = createSignal(null), [de, Y] = createSignal(null), [pt, T$1] = createSignal(true), [ht, Je] = createSignal(null), Ve = "A".toUpperCase(), mt = () => (Ve === "B" || !!de()) && !!ee$1(), gt = () => {
  var _a;
  return (_a = de()) != null ? _a : W(x$1);
};
function yt() {
  return "YB100423253156428";
}
function Ke(e, t) {
  We(x$1, e), localStorage.setItem(z, JSON.stringify(t)), Y(e), H(t);
}
function B() {
  He(x$1), typeof localStorage < "u" && localStorage.removeItem(z), Y(null), H(null);
}
async function Ge(e) {
  var _a, _b;
  const t = e || W(x$1);
  if (!t) return T$1(false), false;
  try {
    const o = await fetch(`${ze}/verify-signature`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: t }, body: JSON.stringify({ token: t }) });
    if (o.status === 401 || o.status === 500) return B(), T$1(false), false;
    if (!o.ok) throw new Error(`HTTP ${o.status}`);
    const r = await o.json();
    if ((r == null ? void 0 : r.valid) && (r == null ? void 0 : r.user)) {
      const n = (_b = (_a = r.user) == null ? void 0 : _a.permissions) != null ? _b : {}, a = { id: r.user.originalUserId || r.user.uid || r.user.id || "", originalUserId: r.user.originalUserId, email: r.user.email || "", name: r.user.displayName || r.user.name || "", picture: r.user.photoURL || r.user.picture || "", businessId: r.user.businessId || "", isAdmin: n.isAdmin || "", permissions: n };
      return Je(null), Ke(t, a), T$1(false), true;
    }
    return B(), T$1(false), false;
  } catch {
    return B(), T$1(false), false;
  }
}
async function bt() {
  const e = W(x$1);
  if (e) {
    const t = Ye();
    t && (Y(e), H(t)), await Ge(e);
  } else B(), T$1(false);
}
const Qe = "locale";
function Xe() {
  return typeof localStorage > "u" ? "es" : localStorage.getItem(Qe) === "en" ? "en" : "es";
}
const [Ze, et] = createSignal("es");
function vt$1() {
  et(Xe());
}
const tt = { es: { "nav.catalog": "Cat\xE1logo", "nav.cart": "Carrito", "nav.offers": "Ofertas", "nav.orders": "Pedidos", "nav.login": "Entrar", "nav.logout": "Salir", "hero.title": "Todo para tu familia, entregado en Cuba", "hero.subtitle": "Compra desde USA. Alimentos, aseo y m\xE1s, enviados a domicilio en Cuba.", "hero.cta": "Ver ofertas", "feat.shipTitle": "Env\xEDo a toda Cuba", "feat.shipDesc": "Entrega a domicilio, provincia y municipio.", "feat.payTitle": "Pago seguro", "feat.payDesc": "Con tarjeta v\xEDa Stripe.", "feat.supportTitle": "Soporte real", "feat.supportDesc": "Te ayudamos con tu pedido.", "promo.eyebrow": "Destacado", "promo.title": "Despensa para tu familia en Cuba", "promo.subtitle": "Arroz, aceite, granos y m\xE1s \u2014 entregado a domicilio.", "promo.cta": "Ver ofertas", "offers.title": "Ofertas", "offers.subtitle": "Lo mejor para enviar a Cuba, disponible ahora.", "offers.combo": "Combo", "offers.pantryTitle": "Combo despensa", "offers.pantryDesc": "Arroz, aceite, granos y m\xE1s.", "offers.cleanTitle": "Combo limpieza y aseo", "offers.cleanDesc": "Detergente, jab\xF3n y productos del hogar.", "offers.drinksTitle": "Combo bebidas", "offers.drinksDesc": "Jugos, refrescos y m\xE1s.", "offers.see": "Ver combo", "offers.available": "Disponibles ahora", "offers.seeAll": "Ver todo el cat\xE1logo", "offers.empty": "No hay productos disponibles ahora mismo.", "combo.includes": "Incluye", "combo.normal": "Precio normal", "combo.save": "Ahorras", "combo.comboPrice": "Precio combo", "combo.add": "Agregar combo al carrito", "combo.note": "El descuento del combo lo aplica la tienda al confirmar tu pedido.", "catalog.title": "Productos", "catalog.search": "Buscar productos\u2026", "catalog.all": "Todas", "catalog.results": "productos", "catalog.empty": "Sin resultados", "catalog.emptyHint": "Prueba con otra b\xFAsqueda o categor\xEDa.", "product.addToCart": "Agregar al carrito", "product.inStock": "Disponible", "product.outOfStock": "Agotado", "product.noPhoto": "Sin foto", "product.back": "Volver al cat\xE1logo", "cart.title": "Tu carrito", "cart.empty": "Tu carrito est\xE1 vac\xEDo.", "cart.subtotal": "Subtotal", "cart.checkout": "Finalizar compra", "cart.remove": "Quitar", "cart.qty": "Cantidad", "checkout.title": "Finalizar compra", "checkout.customer": "Tus datos", "checkout.name": "Nombre", "checkout.email": "Correo (opcional)", "checkout.destination": "Destino del env\xEDo", "checkout.usa": "Estados Unidos", "checkout.cuba": "Cuba", "checkout.recipient": "Nombre del receptor", "checkout.recipientPhone": "Tel\xE9fono del receptor", "checkout.phone": "Tel\xE9fono", "checkout.address": "Direcci\xF3n", "checkout.line2": "Apto / referencia (opcional)", "checkout.city": "Ciudad", "checkout.state": "Estado", "checkout.zip": "C\xF3digo postal", "checkout.province": "Provincia", "checkout.municipality": "Municipio", "checkout.ci": "Carnet de identidad (opcional)", "checkout.shipping": "Env\xEDo", "checkout.total": "Total", "checkout.pay": "Pagar", "checkout.placing": "Procesando\u2026", "checkout.paySuccess": "\xA1Pago recibido! Tu pedido est\xE1 confirmado.", "checkout.pending": "Pedido creado. El comercio lo confirmar\xE1.", "checkout.stripeNote": "Pago seguro con tarjeta v\xEDa Stripe.", "checkout.manualNote": "El comercio confirma tu pedido tras revisarlo.", "orders.title": "Pedidos", "orders.empty": "No hay pedidos.", "orders.search": "Buscar pedidos\u2026", "orders.status": "Estado", "orders.total": "Total", "orders.revenue": "Ingresos", "orders.pending": "Pendientes", "orders.confirmed": "Confirmados", "orders.totalCount": "Total", "orders.confirm": "Confirmar", "orders.cancel": "Cancelar", "orders.items": "art\xEDculos", "status.pending": "pendiente", "status.confirmed": "confirmado", "status.cancelled": "cancelado", "status.expired": "expirado", "login.title": "Panel del comercio", "login.merchant": "Acceso para gestionar pedidos.", "login.continue": "Continuar con SSO", "common.loading": "Cargando\u2026", "common.error": "Algo sali\xF3 mal.", "common.retry": "Reintentar", "wa.label": "Atenci\xF3n al cliente por WhatsApp", "wa.cta": "Ayuda" }, en: { "nav.catalog": "Catalog", "nav.cart": "Cart", "nav.offers": "Deals", "nav.orders": "My orders", "nav.login": "Sign in", "nav.logout": "Sign out", "hero.title": "Everything for your family, delivered in Cuba", "hero.subtitle": "Shop from the US. Food, household goods and more, delivered in Cuba.", "hero.cta": "See deals", "feat.shipTitle": "Delivery across Cuba", "feat.shipDesc": "Door-to-door, province and municipality.", "feat.payTitle": "Secure payment", "feat.payDesc": "Card payments via Stripe.", "feat.supportTitle": "Real support", "feat.supportDesc": "We help with your order.", "promo.eyebrow": "Featured", "promo.title": "Pantry for your family in Cuba", "promo.subtitle": "Rice, oil, grains and more \u2014 delivered to the door.", "promo.cta": "See deals", "offers.title": "Deals", "offers.subtitle": "The best to send to Cuba, available now.", "offers.combo": "Combo", "offers.pantryTitle": "Pantry combo", "offers.pantryDesc": "Rice, oil, grains and more.", "offers.cleanTitle": "Cleaning combo", "offers.cleanDesc": "Detergent, soap and household products.", "offers.drinksTitle": "Drinks combo", "offers.drinksDesc": "Juices, sodas and more.", "offers.see": "View combo", "offers.available": "Available now", "offers.seeAll": "See full catalog", "offers.empty": "No products available right now.", "combo.includes": "Includes", "combo.normal": "Regular price", "combo.save": "You save", "combo.comboPrice": "Combo price", "combo.add": "Add combo to cart", "combo.note": "The combo discount is applied by the store when confirming your order.", "catalog.title": "Products", "catalog.search": "Search products\u2026", "catalog.all": "All", "catalog.results": "products", "catalog.empty": "No results", "catalog.emptyHint": "Try another search or category.", "product.addToCart": "Add to cart", "product.inStock": "In stock", "product.outOfStock": "Out of stock", "product.noPhoto": "No photo", "product.back": "Back to catalog", "cart.title": "Your cart", "cart.empty": "Your cart is empty.", "cart.subtotal": "Subtotal", "cart.checkout": "Checkout", "cart.remove": "Remove", "cart.qty": "Qty", "checkout.title": "Checkout", "checkout.customer": "Your details", "checkout.name": "Name", "checkout.email": "Email (optional)", "checkout.destination": "Shipping destination", "checkout.usa": "United States", "checkout.cuba": "Cuba", "checkout.recipient": "Recipient name", "checkout.recipientPhone": "Recipient phone", "checkout.phone": "Phone", "checkout.address": "Address", "checkout.line2": "Apt / reference (optional)", "checkout.city": "City", "checkout.state": "State", "checkout.zip": "ZIP code", "checkout.province": "Province", "checkout.municipality": "Municipality", "checkout.ci": "ID card (optional)", "checkout.shipping": "Shipping", "checkout.total": "Total", "checkout.pay": "Pay", "checkout.placing": "Processing\u2026", "checkout.paySuccess": "Payment received! Your order is confirmed.", "checkout.pending": "Order created. The merchant will confirm it.", "checkout.stripeNote": "Secure card payment via Stripe.", "checkout.manualNote": "The merchant confirms your order after review.", "orders.title": "Orders", "orders.empty": "No orders.", "orders.search": "Search orders\u2026", "orders.status": "Status", "orders.total": "Total", "orders.revenue": "Revenue", "orders.pending": "Pending", "orders.confirmed": "Confirmed", "orders.totalCount": "Total", "orders.confirm": "Confirm", "orders.cancel": "Cancel", "orders.items": "items", "status.pending": "pending", "status.confirmed": "confirmed", "status.cancelled": "cancelled", "status.expired": "expired", "login.title": "Merchant panel", "login.merchant": "Access to manage orders.", "login.continue": "Continue with SSO", "common.loading": "Loading\u2026", "common.error": "Something went wrong.", "common.retry": "Retry", "wa.label": "Customer service on WhatsApp", "wa.cta": "Help" } };
function kt$1(e) {
  var _a;
  return (_a = tt[Ze()][e]) != null ? _a : e;
}

function U$1(t) {
  t = mergeProps$1({ inactiveClass: "inactive", activeClass: "active" }, t);
  const [, e] = splitProps(t, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), s = st(() => t.href), r = ct(s), a = Be(), o = createMemo(() => {
    const h = s();
    if (h === void 0) return [false, false];
    const f = E(h.split(/[?#]/, 1)[0]).toLowerCase(), l = decodeURI(E(a.pathname).toLowerCase());
    return [t.end ? f === l : l.startsWith(f + "/") || l === f, f === l];
  });
  return ssrElement("a", mergeProps(e, { get href() {
    return r() || t.href;
  }, get state() {
    return JSON.stringify(t.state);
  }, get classList() {
    return { ...t.class && { [t.class]: true }, [t.inactiveClass]: !o()[0], [t.activeClass]: o()[0], ...e.classList };
  }, link: true, get "aria-current"() {
    return o()[1] ? "page" : void 0;
  } }), void 0, true);
}
const b = "https://ssgloghr.com/public/shop", N$1 = "https://ssgloghr.com/api/query";
let m$1 = class m extends Error {
  constructor(e, s, r) {
    super(s), this.status = e, this.retryAfter = r, this.name = "ApiError";
  }
};
async function n$1(t, e = {}) {
  var _a;
  const s = yt(), r = await fetch(`${b}/${s}${t}`, { ...e, headers: { ...e.body ? { "Content-Type": "application/json" } : {}, ...(_a = e.headers) != null ? _a : {} } });
  if (r.status === 429) {
    const h = Number(r.headers.get("Retry-After")) || 60;
    throw new m$1(429, "Too many requests", h);
  }
  if (r.status === 204 || r.status === 304) return;
  const a = await r.json().catch(() => ({}));
  if (!r.ok) throw new m$1(r.status, a.error || a.message || `HTTP ${r.status}`);
  return a && typeof a == "object" && "data" in a ? a.data : a;
}
function j$1(t) {
  const e = new URLSearchParams();
  for (const [r, a] of Object.entries(t)) a != null && a !== "" && e.set(r, String(a));
  const s = e.toString();
  return s ? `?${s}` : "";
}
function i$1(t) {
  var _a, _b, _c, _d;
  const e = t != null ? t : {}, s = (_a = Array.isArray(e.lines) ? e.lines : e.items) != null ? _a : [];
  return { cartId: String((_b = e.cartId) != null ? _b : ""), lines: (Array.isArray(s) ? s : []).map((r) => {
    var _a2, _b2;
    return { ...r, image: S(u$1((_b2 = (_a2 = r.thumbImage) != null ? _a2 : r.mainImage) != null ? _b2 : r.image), 200) };
  }), itemCount: Number((_c = e.itemCount) != null ? _c : 0), subtotal: Number((_d = e.subtotal) != null ? _d : 0) };
}
const g$1 = new URL(b).origin;
function u$1(t) {
  return t && (t.startsWith("/") ? `${g$1}${t}` : t.replace(/^https?:\/\/[^/]+(?=\/public\/shop\/)/, g$1));
}
function S(t, e) {
  return !t || !t.includes("/public/shop/images/") ? t : `${t}${t.includes("?") ? "&" : "?"}w=${e}`;
}
function y$1(t) {
  var _a, _b, _c;
  return { ...t, thumbImage: u$1(t.thumbImage), detailImage: u$1(t.detailImage), image: S(u$1((_b = (_a = t.thumbImage) != null ? _a : t.mainImage) != null ? _b : t.image), 400), images: ((_c = t.images) != null ? _c : []).map((e) => u$1(e)) };
}
function R(t) {
  return (Array.isArray(t == null ? void 0 : t.categories) ? t.categories : Array.isArray(t) ? t : []).map((s) => {
    var _a, _b, _c, _d, _e, _f;
    if (typeof s == "string") return { label: s, value: s };
    const r = s, a = String((_d = (_c = (_b = (_a = r.value) != null ? _a : r.slug) != null ? _b : r.id) != null ? _c : r.name) != null ? _d : "");
    return { label: String((_f = (_e = r.label) != null ? _e : r.name) != null ? _f : a), value: a };
  });
}
async function c(t, e = {}) {
  const s = gt(), r = await fetch(N$1, { method: "POST", headers: { "Content-Type": "application/json", ...s ? { Authorization: `Bearer ${s}` } : {} }, body: JSON.stringify({ query: t, params: e }) });
  if (r.status === 401) throw B(), new m$1(401, "Unauthorized");
  const a = await r.json().catch(() => ({}));
  if (!r.ok || (a == null ? void 0 : a.error)) throw new m$1(r.status || 400, a.error || `HTTP ${r.status}`);
  return a && typeof a == "object" && "data" in a ? a.data : a;
}
const q = { shop: { products: (t = {}) => {
  var _a, _b;
  return n$1(`/products${j$1({ search: t.search, category: t.category, limit: Math.min((_a = t.limit) != null ? _a : 48, 48), offset: Math.min((_b = t.offset) != null ? _b : 0, 2e3) })}`).then((e) => {
    var _a2;
    const s = ((_a2 = e.items) != null ? _a2 : []).filter((r) => r.isPublic === true).map(y$1);
    return { ...e, items: s, count: s.length };
  });
}, product: (t) => n$1(`/products/${t}`).then((e) => {
  if (e.isPublic !== true) throw new m$1(404, "Producto no disponible");
  return y$1(e);
}), categories: () => n$1("/categories").then(R), createCart: () => n$1("/cart", { method: "POST" }).then(i$1), getCart: (t) => n$1(`/cart/${t}`).then(i$1), setItem: (t, e, s) => n$1(`/cart/${t}/items`, { method: "POST", body: JSON.stringify({ productId: e, qty: s }) }).then(i$1), addItemNew: (t, e) => n$1("/cart/items", { method: "POST", body: JSON.stringify({ productId: t, qty: e }) }).then(i$1), clearCart: (t) => n$1(`/cart/${t}`, { method: "DELETE" }).then(i$1), checkout: (t, e) => n$1(`/cart/${t}/checkout`, { method: "POST", body: JSON.stringify(e) }) }, orders: { list: (t = {}) => c("getStorefrontOrders", t), get: (t) => c("getStorefrontOrderById", { id: t }), stats: () => c("getStorefrontOrderStats"), confirm: (t) => c("confirmStorefrontOrder", { orderId: t }), cancel: (t) => c("cancelStorefrontOrder", { orderId: t }) } };

const n = "cartId", [a, o] = createSignal(null), [p, C] = createSignal(false);
function i() {
  return typeof localStorage > "u" ? null : localStorage.getItem(n);
}
function l() {
  typeof localStorage < "u" && localStorage.removeItem(n);
}
const u = (t) => t instanceof m$1 && t.status === 404;
async function m() {
  const t = i();
  if (t) try {
    o(await q.shop.getCart(t));
  } catch (e) {
    u(e) && (l(), o(null));
  }
}
const g = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.itemCount) != null ? _b : 0;
}, y = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.subtotal) != null ? _b : 0;
}, I$1 = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.lines) != null ? _b : [];
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
function wt(e = {}) {
  let t, r = false;
  const o = (a) => {
    if (t && t !== a) throw new Error("Context conflict");
  };
  let n;
  if (e.asyncContext) {
    const a = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    a ? n = new a() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const s = () => {
    if (n) {
      const a = n.getStore();
      if (a !== void 0) return a;
    }
    return t;
  };
  return { use: () => {
    const a = s();
    if (a === void 0) throw new Error("Context is not available");
    return a;
  }, tryUse: () => s(), set: (a, i) => {
    i || o(a), t = a, r = true;
  }, unset: () => {
    t = void 0, r = false;
  }, call: (a, i) => {
    o(a), t = a;
    try {
      return n ? n.run(a, i) : i();
    } finally {
      r || (t = void 0);
    }
  }, async callAsync(a, i) {
    t = a;
    const l = () => {
      t = a;
    }, c = () => t === a ? l : void 0;
    X.add(c);
    try {
      const f = n ? n.run(a, i) : i();
      return r || (t = void 0), await f;
    } finally {
      X.delete(c);
    }
  } };
}
function xt(e = {}) {
  const t = {};
  return { get(r, o = {}) {
    return t[r] || (t[r] = wt({ ...e, ...o })), t[r];
  } };
}
const M = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, V = "__unctx__", vt = M[V] || (M[V] = xt()), $t = (e, t = {}) => vt.get(e, t), Q = "__unctx_async_handlers__", X = M[Q] || (M[Q] = /* @__PURE__ */ new Set());
function Rt(e) {
  let t;
  const r = he(e), o = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(r, { ...o, body: e.node.req.body }) : new Request(r, { ...o, get body() {
    return t || (t = Ht(e), t);
  } });
}
function St(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: Rt(e), url: he(e) }, e.web.request;
}
function Ct() {
  return Ut();
}
const pe = /* @__PURE__ */ Symbol("$HTTPEvent");
function Et(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[pe]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function x(e) {
  return function(...t) {
    var _a;
    let r = t[0];
    if (Et(r)) t[0] = r instanceof H3Event || r.__is_event__ ? r : r[pe];
    else {
      if (!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      if (r = Ct(), !r) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
      t.unshift(r);
    }
    return e(...t);
  };
}
const he = x(getRequestURL), At = x(getRequestIP), I = x(setResponseStatus), Z = x(getResponseStatus), kt = x(getResponseStatusText), N = x(getResponseHeaders), ee = x(getResponseHeader), Tt = x(setResponseHeader), Lt = x(appendResponseHeader), te = x(sendRedirect), Pt = x(getCookie), _t = x(setCookie), qt = x(setHeader), Ht = x(getRequestWebStream), Nt = x(removeResponseHeader), Dt = x(St);
function Mt() {
  var _a;
  return $t("nitro-app", { asyncContext: !!((_a = globalThis.app.config.server.experimental) == null ? void 0 : _a.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function Ut() {
  return Mt().use().event;
}
const k = { NORMAL: 0, WILDCARD: 1, PLACEHOLDER: 2 };
function Ot(e = {}) {
  const t = { options: e, rootNode: me(), staticRoutesMap: {} }, r = (o) => e.strictTrailingSlash ? o : o.replace(/\/$/, "") || "/";
  if (e.routes) for (const o in e.routes) re(t, r(o), e.routes[o]);
  return { ctx: t, lookup: (o) => It(t, r(o)), insert: (o, n) => re(t, r(o), n), remove: (o) => jt(t, r(o)) };
}
function It(e, t) {
  const r = e.staticRoutesMap[t];
  if (r) return r.data;
  const o = t.split("/"), n = {};
  let s = false, a = null, i = e.rootNode, l = null;
  for (let c = 0; c < o.length; c++) {
    const f = o[c];
    i.wildcardChildNode !== null && (a = i.wildcardChildNode, l = o.slice(c).join("/"));
    const R = i.children.get(f);
    if (R === void 0) {
      if (i && i.placeholderChildren.length > 1) {
        const S = o.length - c;
        i = i.placeholderChildren.find((y) => y.maxDepth === S) || null;
      } else i = i.placeholderChildren[0] || null;
      if (!i) break;
      i.paramName && (n[i.paramName] = f), s = true;
    } else i = R;
  }
  return (i === null || i.data === null) && a !== null && (i = a, n[i.paramName || "_"] = l, s = true), i ? s ? { ...i.data, params: s ? n : void 0 } : i.data : null;
}
function re(e, t, r) {
  let o = true;
  const n = t.split("/");
  let s = e.rootNode, a = 0;
  const i = [s];
  for (const l of n) {
    let c;
    if (c = s.children.get(l)) s = c;
    else {
      const f = Ft(l);
      c = me({ type: f, parent: s }), s.children.set(l, c), f === k.PLACEHOLDER ? (c.paramName = l === "*" ? `_${a++}` : l.slice(1), s.placeholderChildren.push(c), o = false) : f === k.WILDCARD && (s.wildcardChildNode = c, c.paramName = l.slice(3) || "_", o = false), i.push(c), s = c;
    }
  }
  for (const [l, c] of i.entries()) c.maxDepth = Math.max(i.length - l, c.maxDepth || 0);
  return s.data = r, o === true && (e.staticRoutesMap[t] = s), s;
}
function jt(e, t) {
  let r = false;
  const o = t.split("/");
  let n = e.rootNode;
  for (const s of o) if (n = n.children.get(s), !n) return r;
  if (n.data) {
    const s = o.at(-1) || "";
    n.data = null, Object.keys(n.children).length === 0 && n.parent && (n.parent.children.delete(s), n.parent.wildcardChildNode = null, n.parent.placeholderChildren = []), r = true;
  }
  return r;
}
function me(e = {}) {
  return { type: e.type || k.NORMAL, maxDepth: 0, parent: e.parent || null, children: /* @__PURE__ */ new Map(), data: e.data || null, paramName: e.paramName || null, wildcardChildNode: null, placeholderChildren: [] };
}
function Ft(e) {
  return e.startsWith("**") ? k.WILDCARD : e[0] === ":" || e === "*" ? k.PLACEHOLDER : k.NORMAL;
}
const fe = [{ page: true, $component: { src: "src/routes/cart.tsx?pick=default&pick=$css", build: () => import('./chunks/build/cart2.mjs'), import: () => import('./chunks/build/cart2.mjs') }, path: "/cart", filePath: "/Users/hector/Documents/marquet/src/routes/cart.tsx" }, { page: true, $component: { src: "src/routes/checkout.tsx?pick=default&pick=$css", build: () => import('./chunks/build/checkout2.mjs'), import: () => import('./chunks/build/checkout2.mjs') }, path: "/checkout", filePath: "/Users/hector/Documents/marquet/src/routes/checkout.tsx" }, { page: true, $component: { src: "src/routes/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index4.mjs'), import: () => import('./chunks/build/index4.mjs') }, path: "/", filePath: "/Users/hector/Documents/marquet/src/routes/index.tsx" }, { page: true, $component: { src: "src/routes/login.tsx?pick=default&pick=$css", build: () => import('./chunks/build/login2.mjs'), import: () => import('./chunks/build/login2.mjs') }, path: "/login", filePath: "/Users/hector/Documents/marquet/src/routes/login.tsx" }, { page: true, $component: { src: "src/routes/ofertas/[combo].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_combo_2.mjs'), import: () => import('./chunks/build/_combo_2.mjs') }, path: "/ofertas/:combo", filePath: "/Users/hector/Documents/marquet/src/routes/ofertas/[combo].tsx" }, { page: true, $component: { src: "src/routes/ofertas/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index22.mjs'), import: () => import('./chunks/build/index22.mjs') }, path: "/ofertas/", filePath: "/Users/hector/Documents/marquet/src/routes/ofertas/index.tsx" }, { page: true, $component: { src: "src/routes/orders/[id].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_id_3.mjs'), import: () => import('./chunks/build/_id_3.mjs') }, path: "/orders/:id", filePath: "/Users/hector/Documents/marquet/src/routes/orders/[id].tsx" }, { page: true, $component: { src: "src/routes/orders/index.tsx?pick=default&pick=$css", build: () => import('./chunks/build/index32.mjs'), import: () => import('./chunks/build/index32.mjs') }, path: "/orders/", filePath: "/Users/hector/Documents/marquet/src/routes/orders/index.tsx" }, { page: true, $component: { src: "src/routes/product/[id].tsx?pick=default&pick=$css", build: () => import('./chunks/build/_id_22.mjs'), import: () => import('./chunks/build/_id_22.mjs') }, path: "/product/:id", filePath: "/Users/hector/Documents/marquet/src/routes/product/[id].tsx" }], Wt = Bt(fe.filter((e) => e.page));
function Bt(e) {
  function t(r, o, n, s) {
    const a = Object.values(r).find((i) => n.startsWith(i.id + "/"));
    return a ? (t(a.children || (a.children = []), o, n.slice(a.id.length)), r) : (r.push({ ...o, id: n, path: n.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/") }), r);
  }
  return e.sort((r, o) => r.path.length - o.path.length).reduce((r, o) => t(r, o, o.path, o.path), []);
}
function zt(e, t) {
  const r = Gt.lookup(e);
  if (r && r.route) {
    const o = r.route, n = t === "HEAD" ? o.$HEAD || o.$GET : o[`$${t}`];
    if (n === void 0) return;
    const s = o.page === true && o.$component !== void 0;
    return { handler: n, params: r.params, isPage: s };
  }
}
function Kt(e) {
  return e.$HEAD || e.$GET || e.$POST || e.$PUT || e.$PATCH || e.$DELETE;
}
const Gt = Ot({ routes: fe.reduce((e, t) => {
  if (!Kt(t)) return e;
  let r = t.path.replace(/\([^)/]+\)/g, "").replace(/\/+/g, "/").replace(/\*([^/]*)/g, (o, n) => `**:${n}`).split("/").map((o) => o.startsWith(":") || o.startsWith("*") ? o : encodeURIComponent(o)).join("/");
  if (/:[^/]*\?/g.test(r)) throw new Error(`Optional parameters are not supported in API routes: ${r}`);
  if (e[r]) throw new Error(`Duplicate API routes for "${r}" found at "${e[r].route.path}" and "${t.path}"`);
  return e[r] = { route: t }, e;
}, {}) }), U = "solidFetchEvent";
function Jt(e) {
  return { request: Dt(e), response: Qt(e), clientAddress: At(e), locals: {}, nativeEvent: e };
}
function Yt(e) {
  if (!e.context[U]) {
    const t = Jt(e);
    e.context[U] = t;
  }
  return e.context[U];
}
class Vt {
  constructor(t) {
    __publicField(this, "event");
    this.event = t;
  }
  get(t) {
    const r = ee(this.event, t);
    return Array.isArray(r) ? r.join(", ") : r || null;
  }
  has(t) {
    return this.get(t) !== null;
  }
  set(t, r) {
    return Tt(this.event, t, r);
  }
  delete(t) {
    return Nt(this.event, t);
  }
  append(t, r) {
    Lt(this.event, t, r);
  }
  getSetCookie() {
    const t = ee(this.event, "Set-Cookie");
    return Array.isArray(t) ? t : [t];
  }
  forEach(t) {
    return Object.entries(N(this.event)).forEach(([r, o]) => t(Array.isArray(o) ? o.join(", ") : o, r, this));
  }
  entries() {
    return Object.entries(N(this.event)).map(([t, r]) => [t, Array.isArray(r) ? r.join(", ") : r])[Symbol.iterator]();
  }
  keys() {
    return Object.keys(N(this.event))[Symbol.iterator]();
  }
  values() {
    return Object.values(N(this.event)).map((t) => Array.isArray(t) ? t.join(", ") : t)[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}
function Qt(e) {
  return { get status() {
    return Z(e);
  }, set status(t) {
    I(e, t);
  }, get statusText() {
    return kt(e);
  }, set statusText(t) {
    I(e, Z(e), t);
  }, headers: new Vt(e) };
}
var Zt = " ";
const er = { style: (e) => ssrElement("style", e.attrs, () => e.children, true), link: (e) => ssrElement("link", e.attrs, void 0, true), script: (e) => e.attrs.src ? ssrElement("script", mergeProps(() => e.attrs, { get id() {
  return e.key;
} }), () => ssr(Zt), true) : null, noscript: (e) => ssrElement("noscript", e.attrs, () => escape(e.children), true) };
function j(e, t) {
  let { tag: r, attrs: { key: o, ...n } = { key: void 0 }, children: s } = e;
  return er[r]({ attrs: { ...n, nonce: t }, key: o, children: s });
}
function tr(e, t, r, o = "default") {
  return lazy(async () => {
    var _a;
    {
      const s = (await e.import())[o], i = (await ((_a = t.inputs) == null ? void 0 : _a[e.src].assets())).filter((c) => c.tag === "style" || c.attrs.rel === "stylesheet");
      return { default: (c) => [...i.map((f) => j(f)), createComponent(s, c)] };
    }
  });
}
function ge() {
  function e(r) {
    return { ...r, ...r.$$route ? r.$$route.require().route : void 0, info: { ...r.$$route ? r.$$route.require().route.info : {}, filesystem: true }, component: r.$component && tr(r.$component, globalThis.MANIFEST.client, globalThis.MANIFEST.ssr), children: r.children ? r.children.map(e) : void 0 };
  }
  return Wt.map(e);
}
let ne;
const rr = isServer ? () => getRequestEvent().routes : () => ne || (ne = ge());
function nr(e) {
  const t = Pt(e.nativeEvent, "flash");
  if (t) try {
    let r = JSON.parse(t);
    if (!r || !r.result) return;
    const o = [...r.input.slice(0, -1), new Map(r.input[r.input.length - 1])], n = r.error ? new Error(r.result) : r.result;
    return { input: o, url: r.url, pending: false, result: r.thrown ? void 0 : n, error: r.thrown ? n : void 0 };
  } catch (r) {
    console.error(r);
  } finally {
    _t(e.nativeEvent, "flash", "", { maxAge: 0 });
  }
}
async function or(e) {
  const t = globalThis.MANIFEST.client;
  return globalThis.MANIFEST.ssr, e.response.headers.set("Content-Type", "text/html"), Object.assign(e, { manifest: await t.json(), assets: [...await t.inputs[t.handler].assets()], router: { submission: nr(e) }, routes: ge(), complete: false, $islands: /* @__PURE__ */ new Set() });
}
const sr = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function F(e) {
  return e.status && sr.has(e.status) ? e.status : 302;
}
function ar(e, t, r = {}, o) {
  return eventHandler({ handler: (n) => {
    const s = Yt(n);
    return provideRequestEvent(s, async () => {
      const a = zt(new URL(s.request.url).pathname, s.request.method);
      if (a) {
        const y = await a.handler.import(), v = s.request.method === "HEAD" ? y.HEAD || y.GET : y[s.request.method];
        s.params = a.params || {}, sharedConfig.context = { event: s };
        const d = await v(s);
        if (d !== void 0) return d;
        if (s.request.method !== "GET") throw new Error(`API handler for ${s.request.method} "${s.request.url}" did not return a response.`);
        if (!a.isPage) return;
      }
      const i = await t(s), l = typeof r == "function" ? await r(i) : { ...r }, c = l.mode || "stream";
      if (l.nonce && (i.nonce = l.nonce), c === "sync") {
        const y = renderToString(() => (sharedConfig.context.event = i, e(i)), l);
        if (i.complete = true, i.response && i.response.headers.get("Location")) {
          const v = F(i.response);
          return te(n, i.response.headers.get("Location"), v);
        }
        return y;
      }
      if (l.onCompleteAll) {
        const y = l.onCompleteAll;
        l.onCompleteAll = (v) => {
          se(i)(v), y(v);
        };
      } else l.onCompleteAll = se(i);
      if (l.onCompleteShell) {
        const y = l.onCompleteShell;
        l.onCompleteShell = (v) => {
          oe(i, n)(), y(v);
        };
      } else l.onCompleteShell = oe(i, n);
      const f = renderToStream(() => (sharedConfig.context.event = i, e(i)), l);
      if (i.response && i.response.headers.get("Location")) {
        const y = F(i.response);
        return te(n, i.response.headers.get("Location"), y);
      }
      if (c === "async") return f;
      const { writable: R, readable: S } = new TransformStream();
      return f.pipeTo(R), S;
    });
  } });
}
function oe(e, t) {
  return () => {
    if (e.response && e.response.headers.get("Location")) {
      const r = F(e.response);
      I(t, r), qt(t, "Location", e.response.headers.get("Location"));
    }
  };
}
function se(e) {
  return ({ write: t }) => {
    e.complete = true;
    const r = e.response && e.response.headers.get("Location");
    r && t(`<script>window.location="${r}"<\/script>`);
  };
}
function ir(e, t, r) {
  return ar(e, or, t);
}
const be = (e) => (t) => {
  const { base: r } = t, o = children(() => t.children), n = createMemo(() => qe(o(), t.base || ""));
  let s;
  const a = dt(e, n, () => s, { base: r, singleFlight: t.singleFlight, transformUrl: t.transformUrl });
  return e.create && e.create(a), createComponent$1(Ne.Provider, { value: a, get children() {
    return createComponent$1(cr, { routerState: a, get root() {
      return t.root;
    }, get preload() {
      return t.rootPreload || t.rootLoad;
    }, get children() {
      return [(s = getOwner()) && null, createComponent$1(lr, { routerState: a, get branches() {
        return n();
      } })];
    } });
  } });
};
function cr(e) {
  const t = e.routerState.location, r = e.routerState.params, o = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: r, location: t, intent: ut() || "initial" });
  }));
  return createComponent$1(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (n) => createComponent$1(n, { params: r, location: t, get data() {
    return o();
  }, get children() {
    return e.children;
  } }) });
}
function lr(e) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      ur(n, e.routerState, e.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = e.routerState.matches().map(({ route: s, path: a, params: i }) => ({ path: s.originalPath, pattern: s.pattern, match: a, params: i, info: s.info }))));
  }
  const t = [];
  let r;
  const o = createMemo(on$1(e.routerState.matches, (n, s, a) => {
    let i = s && n.length === s.length;
    const l = [];
    for (let c = 0, f = n.length; c < f; c++) {
      const R = s && s[c], S = n[c];
      a && R && S.route.key === R.route.key ? l[c] = a[c] : (i = false, t[c] && t[c](), createRoot((y) => {
        t[c] = y, l[c] = ft(e.routerState, l[c - 1] || e.routerState.base, ae(() => o()[c + 1]), () => {
          var _a;
          const v = e.routerState.matches();
          return (_a = v[c]) != null ? _a : v[0];
        });
      }));
    }
    return t.splice(n.length).forEach((c) => c()), a && i ? a : (r = l[0], l);
  }));
  return ae(() => o() && r)();
}
const ae = (e) => () => createComponent$1(Show, { get when() {
  return e();
}, keyed: true, children: (t) => createComponent$1(le.Provider, { value: t, get children() {
  return t.outlet();
} }) });
function ur(e, t, r) {
  const o = new URL(e.request.url), n = F$1(r, new URL(e.router.previousUrl || e.request.url).pathname), s = F$1(r, o.pathname);
  for (let a = 0; a < s.length; a++) {
    (!n[a] || s[a].route !== n[a].route) && (e.router.dataOnly = true);
    const { route: i, params: l } = s[a];
    i.preload && i.preload({ params: l, location: t.location, intent: "preload" });
  }
}
function dr([e, t], r, o) {
  return [e, o ? (n) => t(o(n)) : t];
}
function pr(e) {
  let t = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, o = dr(createSignal(r(e.get()), { equals: (n, s) => n.value === s.value && n.state === s.state }), void 0, (n) => (!t && e.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return e.init && onCleanup(e.init((n = e.get()) => {
    t = true, o[1](r(n)), t = false;
  })), be({ signal: o, create: e.create, utils: e.utils });
}
function hr(e, t, r) {
  return e.addEventListener(t, r), () => e.removeEventListener(t, r);
}
function mr(e, t) {
  const r = e && document.getElementById(e);
  r ? r.scrollIntoView() : t && window.scrollTo(0, 0);
}
function fr(e) {
  const t = new URL(e);
  return t.pathname + t.search;
}
function gr(e) {
  let t;
  const r = { value: e.url || (t = getRequestEvent()) && fr(t.request.url) || "" };
  return be({ signal: [() => r, (o) => Object.assign(r, o)] })(e);
}
const br = /* @__PURE__ */ new Map();
function yr(e = true, t = false, r = "/_server", o) {
  return (n) => {
    const s = n.base.path(), a = n.navigatorFactory(n.base);
    let i, l;
    function c(d) {
      return d.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function f(d) {
      if (d.defaultPrevented || d.button !== 0 || d.metaKey || d.altKey || d.ctrlKey || d.shiftKey) return;
      const h = d.composedPath().find((K) => K instanceof Node && K.nodeName.toUpperCase() === "A");
      if (!h || t && !h.hasAttribute("link")) return;
      const w = c(h), g = w ? h.href.baseVal : h.href;
      if ((w ? h.target.baseVal : h.target) || !g && !h.hasAttribute("state")) return;
      const T = (h.getAttribute("rel") || "").split(/\s+/);
      if (h.hasAttribute("download") || T && T.includes("external")) return;
      const q = w ? new URL(g, document.baseURI) : new URL(g);
      if (!(q.origin !== window.location.origin || s && q.pathname && !q.pathname.toLowerCase().startsWith(s.toLowerCase()))) return [h, q];
    }
    function R(d) {
      const h = f(d);
      if (!h) return;
      const [w, g] = h, z = n.parsePath(g.pathname + g.search + g.hash), T = w.getAttribute("state");
      d.preventDefault(), a(z, { resolve: false, replace: w.hasAttribute("replace"), scroll: !w.hasAttribute("noscroll"), state: T ? JSON.parse(T) : void 0 });
    }
    function S(d) {
      const h = f(d);
      if (!h) return;
      const [w, g] = h;
      o && (g.pathname = o(g.pathname)), n.preloadRoute(g, w.getAttribute("preload") !== "false");
    }
    function y(d) {
      clearTimeout(i);
      const h = f(d);
      if (!h) return l = null;
      const [w, g] = h;
      l !== w && (o && (g.pathname = o(g.pathname)), i = setTimeout(() => {
        n.preloadRoute(g, w.getAttribute("preload") !== "false"), l = w;
      }, 20));
    }
    function v(d) {
      if (d.defaultPrevented) return;
      let h = d.submitter && d.submitter.hasAttribute("formaction") ? d.submitter.getAttribute("formaction") : d.target.getAttribute("action");
      if (!h) return;
      if (!h.startsWith("https://action/")) {
        const g = new URL(h, Ee);
        if (h = n.parsePath(g.pathname + g.search), !h.startsWith(r)) return;
      }
      if (d.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const w = br.get(h);
      if (w) {
        d.preventDefault();
        const g = new FormData(d.target, d.submitter);
        w.call({ r: n, f: d.target }, d.target.enctype === "multipart/form-data" ? g : new URLSearchParams(g));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", R), e && (document.addEventListener("mousemove", y, { passive: true }), document.addEventListener("focusin", S, { passive: true }), document.addEventListener("touchstart", S, { passive: true })), document.addEventListener("submit", v), onCleanup(() => {
      document.removeEventListener("click", R), e && (document.removeEventListener("mousemove", y), document.removeEventListener("focusin", S), document.removeEventListener("touchstart", S)), document.removeEventListener("submit", v);
    });
  };
}
function wr(e) {
  if (isServer) return gr(e);
  const t = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: n };
  }, r = Ae();
  return pr({ get: t, set({ value: o, replace: n, scroll: s, state: a }) {
    n ? window.history.replaceState(nt(a), "", o) : window.history.pushState(a, "", o), mr(decodeURIComponent(window.location.hash.slice(1)), s), ae$1();
  }, init: (o) => hr(window, "popstate", at(o, (n) => {
    if (n) return !r.confirm(n);
    {
      const s = t();
      return !r.confirm(s.value, { state: s.state });
    }
  })), create: yr(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: r } })(e);
}
var xr = ["<div", ' class="relative bg-brand-dark text-white"><div class="mx-auto flex max-w-6xl items-center justify-center px-8 py-2 text-center text-xs font-medium sm:text-sm"><!--$-->', '<!--/--><button type="button" aria-label="Cerrar" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">\u2715</button></div></div>'];
const vr = { es: "\u{1F1E8}\u{1F1FA} Env\xEDo a toda Cuba \xB7 Pedidos confirmados hoy salen primero", en: "\u{1F1E8}\u{1F1FA} Delivery across Cuba \xB7 Orders confirmed today ship first" };
function $r() {
  return (Ze() === "en", void 0) || vr[Ze()];
}
const Rr = "announce_dismissed";
function Sr() {
  const [e, t] = createSignal(typeof sessionStorage < "u" && sessionStorage.getItem(Rr) === "1");
  return createComponent$1(Show, { get when() {
    return !e();
  }, get children() {
    return ssr(xr, ssrHydrationKey(), escape($r()));
  } });
}
var Cr = ["<div", ' class="flex items-center rounded-lg border border-line bg-white p-0.5 text-xs font-semibold">', "</div>"], Er = ["<button", ' type="button" class="', '">', "</button>"];
function Ar() {
  const e = ["es", "en"];
  return ssr(Cr, ssrHydrationKey(), escape(createComponent$1(For, { each: e, children: (t) => ssr(Er, ssrHydrationKey(), `rounded-md px-2 py-1 uppercase transition-colors ${Ze() === t ? "bg-brand text-white" : ""} ${Ze() !== t ? "text-muted hover:text-ink" : ""}`, escape(t)) })));
}
var kr = ["<span", ' class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-base font-extrabold text-white">M</span>'], Tr = ["<span", ' class="font-display text-xl font-extrabold tracking-tight">Marquet</span>'], Lr = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2.5 3.5h2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"></path></svg>'], Pr = ["<span", ' class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">', "</span>"], _r = ["<button", ' type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink">', "</button>"], qr = ["<header", ' class="sticky top-0 z-20 border-b border-line bg-white/80 backdrop-blur-md"><div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4"><!--$-->', '<!--/--><nav class="ml-auto flex items-center gap-1 sm:gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></nav></div></header>"];
function Hr() {
  return ssr(qr, ssrHydrationKey(), escape(createComponent$1(U$1, { href: "/", class: "flex items-center gap-2", end: true, get children() {
    return [ssr(kr, ssrHydrationKey()), ssr(Tr, ssrHydrationKey())];
  } })), escape(createComponent$1(U$1, { href: "/ofertas", class: "hidden rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-tint sm:block", get children() {
    return kt$1("nav.offers");
  } })), escape(createComponent$1(Show, { get when() {
    return mt();
  }, get children() {
    return createComponent$1(U$1, { href: "/orders", class: "hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink sm:block", get children() {
      return kt$1("nav.orders");
    } });
  } })), escape(createComponent$1(U$1, { href: "/cart", class: "relative flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-canvas", get "aria-label"() {
    return kt$1("nav.cart");
  }, get children() {
    return [ssr(Lr, ssrHydrationKey()), createComponent$1(Show, { get when() {
      return g() > 0;
    }, get children() {
      return ssr(Pr, ssrHydrationKey(), escape(g()));
    } })];
  } })), escape(createComponent$1(Ar, {})), escape(createComponent$1(Show, { get when() {
    return mt();
  }, get fallback() {
    return createComponent$1(U$1, { href: "/login", class: "btn-ghost px-3 py-2", get children() {
      return kt$1("nav.login");
    } });
  }, get children() {
    return ssr(_r, ssrHydrationKey(), escape(kt$1("nav.logout")));
  } })));
}
var Nr = ["<a", ' target="_blank" rel="noopener noreferrer"', ' class="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg><span class="hidden text-sm font-semibold sm:inline">', "</span></a>"];
const ie = "13055551234".replace(/\D/g, ""), Dr = "Hola, necesito ayuda con un pedido.";
function Mr() {
  const e = () => `https://wa.me/${ie}?text=${encodeURIComponent(Dr)}`;
  return createComponent$1(Show, { when: ie, get children() {
    return ssr(Nr, ssrHydrationKey() + ssrAttribute("href", escape(e(), true), false), ssrAttribute("aria-label", escape(kt$1("wa.label"), true), false) + ssrAttribute("title", escape(kt$1("wa.label"), true), false), escape(kt$1("wa.cta")));
  } });
}
var Ur = ["<div", ' class="min-h-screen flex flex-col"><!--$-->', "<!--/--><!--$-->", '<!--/--><main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">', '</main><footer class="border-t border-line bg-white"><div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted"><span class="font-display font-bold text-ink">Marquet</span><span>\xA9 2026 \xB7 USA \u2192 Cuba</span></div></footer><!--$-->', "<!--/--></div>"], Or = ["<div", ' class="flex flex-col items-center gap-3 py-24 text-center"><p class="text-muted">', '</p><button type="button" class="btn-ghost px-4 py-2">', "</button></div>"], Ir = ["<div", ' class="py-24 text-center text-muted">', "</div>"];
function jr() {
  return onMount(() => {
    vt$1(), m(), bt();
  }), createComponent$1(wr, { root: (e) => createComponent$1(I$2, { get children() {
    return [createComponent$1(k$1, { children: "Marquet \u2014 Compra desde USA, entrega en Cuba" }), createComponent$1(H$1, { name: "description", content: "Tienda online para enviar alimentos, aseo y productos del hogar a tu familia en Cuba. Compra desde USA con entrega a domicilio." }), ssr(Ur, ssrHydrationKey(), escape(createComponent$1(Sr, {})), escape(createComponent$1(Hr, {})), escape(createComponent$1(ErrorBoundary, { fallback: (t, r) => ssr(Or, ssrHydrationKey(), escape(kt$1("common.error")), escape(kt$1("common.retry"))), get children() {
      return createComponent$1(Suspense, { get fallback() {
        return ssr(Ir, ssrHydrationKey(), escape(kt$1("common.loading")));
      }, get children() {
        return e.children;
      } });
    } })), escape(createComponent$1(Mr, {})))];
  } }), get children() {
    return createComponent$1(rr, {});
  } });
}
const ye = isServer ? (e) => {
  const t = getRequestEvent();
  return t.response.status = e.code, t.response.statusText = e.text, onCleanup(() => !t.nativeEvent.handled && !t.complete && (t.response.status = 200)), null;
} : (e) => null;
var Fr = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">', "</span>"], Wr = ["<span", ' style="font-size:1.5em;text-align:center;position:fixed;left:0px;bottom:55%;width:100%;">500 | Internal Server Error</span>'];
const Br = (e) => {
  const t = isServer ? "500 | Internal Server Error" : "Error | Uncaught Client Exception";
  return createComponent$1(ErrorBoundary, { fallback: (r) => (console.error(r), [ssr(Fr, ssrHydrationKey(), escape(t)), createComponent$1(ye, { code: 500 })]), get children() {
    return e.children;
  } });
}, zr = (e) => {
  let t = false;
  const r = catchError(() => e.children, (o) => {
    console.error(o), t = !!o;
  });
  return t ? [ssr(Wr, ssrHydrationKey()), createComponent$1(ye, { code: 500 })] : r;
};
var ce = ["<script", ">", "<\/script>"], Kr = ["<script", ' type="module"', " async", "><\/script>"], Gr = ["<script", ' type="module" async', "><\/script>"];
const Jr = ssr("<!DOCTYPE html>");
function we(e, t, r = []) {
  for (let o = 0; o < t.length; o++) {
    const n = t[o];
    if (n.path !== e[0].path) continue;
    let s = [...r, n];
    if (n.children) {
      const a = e.slice(1);
      if (a.length === 0 || (s = we(a, n.children, s), !s)) continue;
    }
    return s;
  }
}
function Yr(e) {
  const t = getRequestEvent(), r = t.nonce;
  let o = [];
  return Promise.resolve().then(async () => {
    let n = [];
    if (t.router && t.router.matches) {
      const s = [...t.router.matches];
      for (; s.length && (!s[0].info || !s[0].info.filesystem); ) s.shift();
      const a = s.length && we(s, t.routes);
      if (a) {
        const i = globalThis.MANIFEST.client.inputs;
        for (let l = 0; l < a.length; l++) {
          const c = a[l], f = i[c.$component.src];
          n.push(f.assets());
        }
      }
    }
    o = await Promise.all(n).then((s) => [...new Map(s.flat().map((a) => [a.attrs.key, a])).values()].filter((a) => a.attrs.rel === "modulepreload" && !t.assets.find((i) => i.attrs.key === a.attrs.key)));
  }), useAssets(() => o.length ? o.map((n) => j(n)) : void 0), createComponent$1(NoHydration, { get children() {
    return [Jr, createComponent$1(zr, { get children() {
      return createComponent$1(e.document, { get assets() {
        return [createComponent$1(HydrationScript, {}), t.assets.map((n) => j(n, r))];
      }, get scripts() {
        return r ? [ssr(ce, ssrHydrationKey() + ssrAttribute("nonce", escape(r, true), false), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(Kr, ssrHydrationKey(), ssrAttribute("nonce", escape(r, true), false), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))] : [ssr(ce, ssrHydrationKey(), `window.manifest = ${JSON.stringify(t.manifest)}`), ssr(Gr, ssrHydrationKey(), ssrAttribute("src", escape(globalThis.MANIFEST.client.inputs[globalThis.MANIFEST.client.handler].output.path, true), false))];
      }, get children() {
        return createComponent$1(Hydration, { get children() {
          return createComponent$1(Br, { get children() {
            return createComponent$1(jr, {});
          } });
        } });
      } });
    } })];
  } });
}
var Vr = ['<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="/favicon.ico"><meta name="theme-color" content="#0c6b58"><meta name="robots" content="index, follow"><link rel="canonical" href="https://marquet.example.com/"><meta property="og:type" content="website"><meta property="og:site_name" content="Marquet"><meta property="og:title" content="Marquet \u2014 Compra desde USA, entrega en Cuba"><meta property="og:description" content="Alimentos, aseo y m\xE1s para tu familia en Cuba. Entrega a domicilio."><meta property="og:image" content="/img/hero.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Marquet \u2014 USA \u2192 Cuba"><meta name="twitter:description" content="Alimentos, aseo y m\xE1s para tu familia en Cuba."><meta name="twitter:image" content="/img/hero.jpg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Plus+Jakarta+Sans:wght@600;700;800&amp;display=swap">', "</head>"], Qr = ["<html", ' lang="es">', '<body><div id="app">', "</div><!--$-->", "<!--/--></body></html>"];
const cn = ir(() => createComponent$1(Yr, { document: ({ assets: e, children: t, scripts: r }) => ssr(Qr, ssrHydrationKey(), createComponent$1(NoHydration, { get children() {
  return ssr(Vr, escape(e));
} }), escape(t), escape(r)) }));

const handlers = [
  { route: '', handler: _EVBIAF, lazy: false, middleware: true, method: undefined },
  { route: '/_server', handler: fu, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: cn, lazy: false, middleware: true, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$2(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$3(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const server = Bun.serve({
  port: process.env.NITRO_PORT || process.env.PORT || 3e3,
  host: process.env.NITRO_HOST || process.env.HOST,
  idleTimeout: Number.parseInt(process.env.NITRO_BUN_IDLE_TIMEOUT) || void 0,
  websocket: void 0,
  async fetch(req, server2) {
    const url = new URL(req.url);
    let body;
    if (req.body) {
      body = await req.arrayBuffer();
    }
    return nitroApp.localFetch(url.pathname + url.search, {
      host: url.hostname,
      protocol: url.protocol,
      headers: req.headers,
      method: req.method,
      redirect: req.redirect,
      body
    });
  }
});
console.log(`Listening on ${server.url}...`);

export { Ge as G, I$1 as I, U$1 as U, kt$1 as a, pt as b, au as c, ht as h, it as i, je as j, k$1 as k, lt as l, mt as m, p, q, y };
//# sourceMappingURL=index.mjs.map
