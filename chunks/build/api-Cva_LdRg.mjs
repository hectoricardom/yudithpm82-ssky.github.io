import { ssrElement, mergeProps as mergeProps$1 } from 'solid-js/web';
import { mergeProps, splitProps, createMemo } from 'solid-js';
import { s as st, g as ct, B as Be, o as E$1, r as gt, t as B, y as yt } from './i18n-BOvpsPhe.mjs';

function E(t) {
  t = mergeProps({ inactiveClass: "inactive", activeClass: "active" }, t);
  const [, e] = splitProps(t, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), o = st(() => t.href), r = ct(o), s = Be(), n = createMemo(() => {
    const u = o();
    if (u === void 0) return [false, false];
    const l = E$1(u.split(/[?#]/, 1)[0]).toLowerCase(), h = decodeURI(E$1(s.pathname).toLowerCase());
    return [t.end ? l === h : h.startsWith(l + "/") || h === l, l === h];
  });
  return ssrElement("a", mergeProps$1(e, { get href() {
    return r() || t.href;
  }, get state() {
    return JSON.stringify(t.state);
  }, get classList() {
    return { ...t.class && { [t.class]: true }, [t.inactiveClass]: !n()[0], [t.activeClass]: n()[0], ...e.classList };
  }, link: true, get "aria-current"() {
    return n()[1] ? "page" : void 0;
  } }), void 0, true);
}
const P = "https://ssgloghr.com/public/shop", T = "https://ssgloghr.com/query";
class f extends Error {
  constructor(e, o, r) {
    super(o), this.status = e, this.retryAfter = r, this.name = "ApiError";
  }
}
async function a(t, e = {}) {
  var _a;
  const o = yt(), r = await fetch(`${P}/${o}${t}`, { ...e, headers: { ...e.body ? { "Content-Type": "application/json" } : {}, ...(_a = e.headers) != null ? _a : {} } });
  if (r.status === 429) {
    const u = Number(r.headers.get("Retry-After")) || 60;
    throw new f(429, "Too many requests", u);
  }
  if (r.status === 204 || r.status === 304) return;
  const s = await r.json().catch(() => ({}));
  if (!r.ok) throw new f(r.status, s.error || s.message || `HTTP ${r.status}`);
  return s && typeof s == "object" && "data" in s ? s.data : s;
}
function $(t) {
  const e = new URLSearchParams();
  for (const [r, s] of Object.entries(t)) s != null && s !== "" && e.set(r, String(s));
  const o = e.toString();
  return o ? `?${o}` : "";
}
function i(t) {
  var _a, _b, _c, _d;
  const e = t != null ? t : {}, o = (_a = Array.isArray(e.lines) ? e.lines : e.items) != null ? _a : [];
  return { cartId: String((_b = e.cartId) != null ? _b : ""), lines: Array.isArray(o) ? o : [], itemCount: Number((_c = e.itemCount) != null ? _c : 0), subtotal: Number((_d = e.subtotal) != null ? _d : 0) };
}
function j(t) {
  return (Array.isArray(t == null ? void 0 : t.categories) ? t.categories : Array.isArray(t) ? t : []).map((o) => {
    var _a, _b, _c, _d, _e, _f;
    if (typeof o == "string") return { label: o, value: o };
    const r = o, s = String((_d = (_c = (_b = (_a = r.value) != null ? _a : r.slug) != null ? _b : r.id) != null ? _c : r.name) != null ? _d : "");
    return { label: String((_f = (_e = r.label) != null ? _e : r.name) != null ? _f : s), value: s };
  });
}
async function c(t, e = {}) {
  const o = gt(), r = await fetch(T, { method: "POST", headers: { "Content-Type": "application/json", ...o ? { Authorization: `Bearer ${o}` } : {} }, body: JSON.stringify({ query: t, params: e }) });
  if (r.status === 401) throw B(), new f(401, "Unauthorized");
  const s = await r.json().catch(() => ({}));
  if (!r.ok || (s == null ? void 0 : s.error)) throw new f(r.status || 400, s.error || `HTTP ${r.status}`);
  return s && typeof s == "object" && "data" in s ? s.data : s;
}
const I = { shop: { products: (t = {}) => {
  var _a, _b;
  return a(`/products${$({ search: t.search, category: t.category, limit: Math.min((_a = t.limit) != null ? _a : 48, 48), offset: Math.min((_b = t.offset) != null ? _b : 0, 2e3) })}`);
}, product: (t) => a(`/products/${t}`), categories: () => a("/categories").then(j), createCart: () => a("/cart", { method: "POST" }).then(i), getCart: (t) => a(`/cart/${t}`).then(i), setItem: (t, e, o) => a(`/cart/${t}/items`, { method: "POST", body: JSON.stringify({ productId: e, qty: o }) }).then(i), addItemNew: (t, e) => a("/cart/items", { method: "POST", body: JSON.stringify({ productId: t, qty: e }) }).then(i), clearCart: (t) => a(`/cart/${t}`, { method: "DELETE" }).then(i), checkout: (t, e) => a(`/cart/${t}/checkout`, { method: "POST", body: JSON.stringify(e) }) }, orders: { list: (t = {}) => c("getStorefrontOrders", t), get: (t) => c("getStorefrontOrderById", { id: t }), stats: () => c("getStorefrontOrderStats"), confirm: (t) => c("confirmStorefrontOrder", { orderId: t }), cancel: (t) => c("cancelStorefrontOrder", { orderId: t }) } };

export { E, I, f };
//# sourceMappingURL=api-Cva_LdRg.mjs.map
