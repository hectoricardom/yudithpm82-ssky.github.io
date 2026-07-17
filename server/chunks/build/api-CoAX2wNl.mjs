import { ssrElement, mergeProps as mergeProps$1 } from 'solid-js/web';
import { mergeProps, splitProps, createMemo } from 'solid-js';
import { s as st, g as ct, B as Be, o as E, r as gt, t as B, y as yt } from './i18n-BOvpsPhe.mjs';

function U(t) {
  t = mergeProps({ inactiveClass: "inactive", activeClass: "active" }, t);
  const [, e] = splitProps(t, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), s = st(() => t.href), r = ct(s), a = Be(), o = createMemo(() => {
    const h = s();
    if (h === void 0) return [false, false];
    const f = E(h.split(/[?#]/, 1)[0]).toLowerCase(), l = decodeURI(E(a.pathname).toLowerCase());
    return [t.end ? f === l : l.startsWith(f + "/") || l === f, f === l];
  });
  return ssrElement("a", mergeProps$1(e, { get href() {
    return r() || t.href;
  }, get state() {
    return JSON.stringify(t.state);
  }, get classList() {
    return { ...t.class && { [t.class]: true }, [t.inactiveClass]: !o()[0], [t.activeClass]: o()[0], ...e.classList };
  }, link: true, get "aria-current"() {
    return o()[1] ? "page" : void 0;
  } }), void 0, true);
}
const b = "https://ssgloghr.com/public/shop", N = "https://ssgloghr.com/api/query";
class m extends Error {
  constructor(e, s, r) {
    super(s), this.status = e, this.retryAfter = r, this.name = "ApiError";
  }
}
async function n(t, e = {}) {
  var _a;
  const s = yt(), r = await fetch(`${b}/${s}${t}`, { ...e, headers: { ...e.body ? { "Content-Type": "application/json" } : {}, ...(_a = e.headers) != null ? _a : {} } });
  if (r.status === 429) {
    const h = Number(r.headers.get("Retry-After")) || 60;
    throw new m(429, "Too many requests", h);
  }
  if (r.status === 204 || r.status === 304) return;
  const a = await r.json().catch(() => ({}));
  if (!r.ok) throw new m(r.status, a.error || a.message || `HTTP ${r.status}`);
  return a && typeof a == "object" && "data" in a ? a.data : a;
}
function j(t) {
  const e = new URLSearchParams();
  for (const [r, a] of Object.entries(t)) a != null && a !== "" && e.set(r, String(a));
  const s = e.toString();
  return s ? `?${s}` : "";
}
function i(t) {
  var _a, _b, _c, _d;
  const e = t != null ? t : {}, s = (_a = Array.isArray(e.lines) ? e.lines : e.items) != null ? _a : [];
  return { cartId: String((_b = e.cartId) != null ? _b : ""), lines: (Array.isArray(s) ? s : []).map((r) => {
    var _a2, _b2;
    return { ...r, image: S(u((_b2 = (_a2 = r.thumbImage) != null ? _a2 : r.mainImage) != null ? _b2 : r.image), 200) };
  }), itemCount: Number((_c = e.itemCount) != null ? _c : 0), subtotal: Number((_d = e.subtotal) != null ? _d : 0) };
}
const g = new URL(b).origin;
function u(t) {
  return t && (t.startsWith("/") ? `${g}${t}` : t.replace(/^https?:\/\/[^/]+(?=\/public\/shop\/)/, g));
}
function S(t, e) {
  return !t || !t.includes("/public/shop/images/") ? t : `${t}${t.includes("?") ? "&" : "?"}w=${e}`;
}
function y(t) {
  var _a, _b, _c;
  return { ...t, thumbImage: u(t.thumbImage), detailImage: u(t.detailImage), image: S(u((_b = (_a = t.thumbImage) != null ? _a : t.mainImage) != null ? _b : t.image), 400), images: ((_c = t.images) != null ? _c : []).map((e) => u(e)) };
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
  const s = gt(), r = await fetch(N, { method: "POST", headers: { "Content-Type": "application/json", ...s ? { Authorization: `Bearer ${s}` } : {} }, body: JSON.stringify({ query: t, params: e }) });
  if (r.status === 401) throw B(), new m(401, "Unauthorized");
  const a = await r.json().catch(() => ({}));
  if (!r.ok || (a == null ? void 0 : a.error)) throw new m(r.status || 400, a.error || `HTTP ${r.status}`);
  return a && typeof a == "object" && "data" in a ? a.data : a;
}
const q = { shop: { products: (t = {}) => {
  var _a, _b;
  return n(`/products${j({ search: t.search, category: t.category, limit: Math.min((_a = t.limit) != null ? _a : 48, 48), offset: Math.min((_b = t.offset) != null ? _b : 0, 2e3) })}`).then((e) => {
    var _a2;
    const s = ((_a2 = e.items) != null ? _a2 : []).filter((r) => r.isPublic === true).map(y);
    return { ...e, items: s, count: s.length };
  });
}, product: (t) => n(`/products/${t}`).then((e) => {
  if (e.isPublic !== true) throw new m(404, "Producto no disponible");
  return y(e);
}), categories: () => n("/categories").then(R), createCart: () => n("/cart", { method: "POST" }).then(i), getCart: (t) => n(`/cart/${t}`).then(i), setItem: (t, e, s) => n(`/cart/${t}/items`, { method: "POST", body: JSON.stringify({ productId: e, qty: s }) }).then(i), addItemNew: (t, e) => n("/cart/items", { method: "POST", body: JSON.stringify({ productId: t, qty: e }) }).then(i), clearCart: (t) => n(`/cart/${t}`, { method: "DELETE" }).then(i), checkout: (t, e) => n(`/cart/${t}/checkout`, { method: "POST", body: JSON.stringify(e) }) }, orders: { list: (t = {}) => c("getStorefrontOrders", t), get: (t) => c("getStorefrontOrderById", { id: t }), stats: () => c("getStorefrontOrderStats"), confirm: (t) => c("confirmStorefrontOrder", { orderId: t }), cancel: (t) => c("cancelStorefrontOrder", { orderId: t }) } };

export { U, m, q };
//# sourceMappingURL=api-CoAX2wNl.mjs.map
