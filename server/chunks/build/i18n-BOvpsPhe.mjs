import { createSignal, createMemo, createRenderEffect, on, useContext, runWithOwner, createContext, untrack, getOwner, startTransition, resetErrorBoundaries, batch, createComponent } from 'solid-js';
import { isServer, getRequestEvent } from 'solid-js/web';

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
let q;
function ae() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), q = window.history.state._depth;
}
isServer || ae();
function nt(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function at(e, t) {
  let o = false;
  return () => {
    const r = q;
    ae();
    const n = r == null ? null : q - r;
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
function j(e, t, o) {
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
function se(e) {
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
function ce(e) {
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
function ie(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t) return [e];
  let o = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const n = [o, o += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); ) n.push(o += t[1]), r = r.slice(t[0].length);
  return ie(r).reduce((a, s) => [...a, ...n.map((i) => i + s)], []);
}
const Ue = 100, Ne = createContext(), le = createContext(), D = () => De(useContext(Ne), "<A> and 'use' router primitives can be only used inside a Route."), _e = () => useContext(le) || D().base, st = (e) => {
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
    for (const m of ie(u)) {
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
function F(e, t) {
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
  }, r, { equals: (u, m) => u.href === m.href }), a = createMemo(() => n().pathname), s = createMemo(() => n().search, true), i = createMemo(() => n().hash), d = () => "", f = on(s, () => se(n()));
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
  }, query: o ? o(f) : ce(f) };
}
let S;
function ut() {
  return S;
}
function dt(e, t, o, r = {}) {
  const { signal: [n, a], utils: s = {} } = e, i = s.parsePath || ((c) => c), d = s.renderPath || ((c) => c), f = s.beforeLeave || Ae(), u = j("", r.base || "");
  if (u === void 0) throw new Error(`${u} is not a valid base path`);
  u && !n().value && a({ value: u, replace: true, scroll: false });
  const [m, h] = createSignal(false);
  let p;
  const y = (c, l) => {
    l.value === k() && l.state === O() || (p === void 0 && h(true), S = c, p = l, startTransition(() => {
      p === l && (R(p.value), fe(p.state), resetErrorBoundaries(), isServer || J[1]((g) => g.filter((C) => C.pending)));
    }).finally(() => {
      p === l && batch(() => {
        S = void 0, c === "navigate" && ge(p), h(false), p = void 0;
      });
    }));
  }, [k, R] = createSignal(n().value), [O, fe] = createSignal(n().state), I = Me(k, O, s.queryWrapper), L = [], J = createSignal(isServer ? be() : []), V = createMemo(() => typeof r.transformUrl == "function" ? F(t(), r.transformUrl(I.pathname)) : F(t(), I.pathname)), K = () => {
    const c = V(), l = {};
    for (let g = 0; g < c.length; g++) Object.assign(l, c[g].params);
    return l;
  }, pe = s.paramsWrapper ? s.paramsWrapper(K, t) : ce(K), G = { pattern: u, path: () => u, outlet: () => null, resolvePath(c) {
    return j(u, c);
  } };
  return createRenderEffect(on(n, (c) => y("native", c), { defer: true })), { base: G, location: I, params: pe, isRouting: m, renderPath: d, parsePath: i, navigatorFactory: me, matches: V, beforeLeave: f, preloadRoute: ye, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: J };
  function he(c, l, g) {
    untrack(() => {
      if (typeof l == "number") {
        l && (s.go ? s.go(l) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const C = !l || l[0] === "?", { replace: U, resolve: w, scroll: N, state: P } = { replace: false, resolve: !C, scroll: true, ...g }, A = w ? c.resolvePath(l) : j(C && I.pathname || "", l);
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
    const g = F(t(), c.pathname), C = S;
    S = "preload";
    for (let U in g) {
      const { route: w, params: N } = g[U];
      w.component && w.component.preload && w.component.preload();
      const { preload: P } = w;
      l && P && runWithOwner(o(), () => P({ params: N, location: { pathname: c.pathname, search: c.search, hash: c.hash, query: se(c), state: null, key: "" }, intent: "preload" }));
    }
    S = C;
  }
  function be() {
    const c = getRequestEvent();
    return c && c.router && c.router.submission ? [c.router.submission] : [];
  }
}
function ft(e, t, o, r) {
  const { base: n, location: a, params: s } = e, { pattern: i, component: d, preload: f } = r().route, u = createMemo(() => r().path);
  d && d.preload && d.preload();
  const m = f ? f({ params: s, location: a, intent: S || "initial" }) : void 0;
  return { parent: t, pattern: i, path: u, outlet: () => d ? createComponent(d, { params: s, location: a, data: m, get children() {
    return o();
  } }) : o(), resolvePath(p) {
    return j(n.path(), p, u());
  } };
}
const ze = "https://ssgloghr.com/auth", x = "ssgl_access_tkn", z = "auth_user";
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
const [ee, H] = createSignal(null), [de, Y] = createSignal(null), [pt, T] = createSignal(true), [ht, Je] = createSignal(null), Ve = "A".toUpperCase(), mt = () => (Ve === "B" || !!de()) && !!ee(), gt = () => {
  var _a;
  return (_a = de()) != null ? _a : W(x);
};
function yt() {
  return "YB100423253156428";
}
function Ke(e, t) {
  We(x, e), localStorage.setItem(z, JSON.stringify(t)), Y(e), H(t);
}
function B() {
  He(x), typeof localStorage < "u" && localStorage.removeItem(z), Y(null), H(null);
}
async function Ge(e) {
  var _a, _b;
  const t = e || W(x);
  if (!t) return T(false), false;
  try {
    const o = await fetch(`${ze}/verify-signature`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: t }, body: JSON.stringify({ token: t }) });
    if (o.status === 401 || o.status === 500) return B(), T(false), false;
    if (!o.ok) throw new Error(`HTTP ${o.status}`);
    const r = await o.json();
    if ((r == null ? void 0 : r.valid) && (r == null ? void 0 : r.user)) {
      const n = (_b = (_a = r.user) == null ? void 0 : _a.permissions) != null ? _b : {}, a = { id: r.user.originalUserId || r.user.uid || r.user.id || "", originalUserId: r.user.originalUserId, email: r.user.email || "", name: r.user.displayName || r.user.name || "", picture: r.user.photoURL || r.user.picture || "", businessId: r.user.businessId || "", isAdmin: n.isAdmin || "", permissions: n };
      return Je(null), Ke(t, a), T(false), true;
    }
    return B(), T(false), false;
  } catch {
    return B(), T(false), false;
  }
}
async function bt() {
  const e = W(x);
  if (e) {
    const t = Ye();
    t && (Y(e), H(t)), await Ge(e);
  } else B(), T(false);
}
const Qe = "locale";
function Xe() {
  return typeof localStorage > "u" ? "es" : localStorage.getItem(Qe) === "en" ? "en" : "es";
}
const [Ze, et] = createSignal("es");
function vt() {
  et(Xe());
}
const tt = { es: { "nav.catalog": "Cat\xE1logo", "nav.cart": "Carrito", "nav.offers": "Ofertas", "nav.orders": "Pedidos", "nav.login": "Entrar", "nav.logout": "Salir", "hero.title": "Todo para tu familia, entregado en Cuba", "hero.subtitle": "Compra desde USA. Alimentos, aseo y m\xE1s, enviados a domicilio en Cuba.", "hero.cta": "Ver ofertas", "feat.shipTitle": "Env\xEDo a toda Cuba", "feat.shipDesc": "Entrega a domicilio, provincia y municipio.", "feat.payTitle": "Pago seguro", "feat.payDesc": "Con tarjeta v\xEDa Stripe.", "feat.supportTitle": "Soporte real", "feat.supportDesc": "Te ayudamos con tu pedido.", "promo.eyebrow": "Destacado", "promo.title": "Despensa para tu familia en Cuba", "promo.subtitle": "Arroz, aceite, granos y m\xE1s \u2014 entregado a domicilio.", "promo.cta": "Ver ofertas", "offers.title": "Ofertas", "offers.subtitle": "Lo mejor para enviar a Cuba, disponible ahora.", "offers.combo": "Combo", "offers.pantryTitle": "Combo despensa", "offers.pantryDesc": "Arroz, aceite, granos y m\xE1s.", "offers.cleanTitle": "Combo limpieza y aseo", "offers.cleanDesc": "Detergente, jab\xF3n y productos del hogar.", "offers.drinksTitle": "Combo bebidas", "offers.drinksDesc": "Jugos, refrescos y m\xE1s.", "offers.see": "Ver combo", "offers.available": "Disponibles ahora", "offers.seeAll": "Ver todo el cat\xE1logo", "offers.empty": "No hay productos disponibles ahora mismo.", "combo.includes": "Incluye", "combo.normal": "Precio normal", "combo.save": "Ahorras", "combo.comboPrice": "Precio combo", "combo.add": "Agregar combo al carrito", "combo.note": "El descuento del combo lo aplica la tienda al confirmar tu pedido.", "catalog.title": "Productos", "catalog.search": "Buscar productos\u2026", "catalog.all": "Todas", "catalog.results": "productos", "catalog.empty": "Sin resultados", "catalog.emptyHint": "Prueba con otra b\xFAsqueda o categor\xEDa.", "product.addToCart": "Agregar al carrito", "product.inStock": "Disponible", "product.outOfStock": "Agotado", "product.noPhoto": "Sin foto", "product.back": "Volver al cat\xE1logo", "cart.title": "Tu carrito", "cart.empty": "Tu carrito est\xE1 vac\xEDo.", "cart.subtotal": "Subtotal", "cart.checkout": "Finalizar compra", "cart.remove": "Quitar", "cart.qty": "Cantidad", "checkout.title": "Finalizar compra", "checkout.customer": "Tus datos", "checkout.name": "Nombre", "checkout.email": "Correo (opcional)", "checkout.destination": "Destino del env\xEDo", "checkout.usa": "Estados Unidos", "checkout.cuba": "Cuba", "checkout.recipient": "Nombre del receptor", "checkout.recipientPhone": "Tel\xE9fono del receptor", "checkout.phone": "Tel\xE9fono", "checkout.address": "Direcci\xF3n", "checkout.line2": "Apto / referencia (opcional)", "checkout.city": "Ciudad", "checkout.state": "Estado", "checkout.zip": "C\xF3digo postal", "checkout.province": "Provincia", "checkout.municipality": "Municipio", "checkout.ci": "Carnet de identidad (opcional)", "checkout.shipping": "Env\xEDo", "checkout.total": "Total", "checkout.pay": "Pagar", "checkout.placing": "Procesando\u2026", "checkout.paySuccess": "\xA1Pago recibido! Tu pedido est\xE1 confirmado.", "checkout.pending": "Pedido creado. El comercio lo confirmar\xE1.", "checkout.stripeNote": "Pago seguro con tarjeta v\xEDa Stripe.", "checkout.manualNote": "El comercio confirma tu pedido tras revisarlo.", "orders.title": "Pedidos", "orders.empty": "No hay pedidos.", "orders.search": "Buscar pedidos\u2026", "orders.status": "Estado", "orders.total": "Total", "orders.revenue": "Ingresos", "orders.pending": "Pendientes", "orders.confirmed": "Confirmados", "orders.totalCount": "Total", "orders.confirm": "Confirmar", "orders.cancel": "Cancelar", "orders.items": "art\xEDculos", "status.pending": "pendiente", "status.confirmed": "confirmado", "status.cancelled": "cancelado", "status.expired": "expirado", "login.title": "Panel del comercio", "login.merchant": "Acceso para gestionar pedidos.", "login.continue": "Continuar con SSO", "common.loading": "Cargando\u2026", "common.error": "Algo sali\xF3 mal.", "common.retry": "Reintentar", "wa.label": "Atenci\xF3n al cliente por WhatsApp", "wa.cta": "Ayuda" }, en: { "nav.catalog": "Catalog", "nav.cart": "Cart", "nav.offers": "Deals", "nav.orders": "My orders", "nav.login": "Sign in", "nav.logout": "Sign out", "hero.title": "Everything for your family, delivered in Cuba", "hero.subtitle": "Shop from the US. Food, household goods and more, delivered in Cuba.", "hero.cta": "See deals", "feat.shipTitle": "Delivery across Cuba", "feat.shipDesc": "Door-to-door, province and municipality.", "feat.payTitle": "Secure payment", "feat.payDesc": "Card payments via Stripe.", "feat.supportTitle": "Real support", "feat.supportDesc": "We help with your order.", "promo.eyebrow": "Featured", "promo.title": "Pantry for your family in Cuba", "promo.subtitle": "Rice, oil, grains and more \u2014 delivered to the door.", "promo.cta": "See deals", "offers.title": "Deals", "offers.subtitle": "The best to send to Cuba, available now.", "offers.combo": "Combo", "offers.pantryTitle": "Pantry combo", "offers.pantryDesc": "Rice, oil, grains and more.", "offers.cleanTitle": "Cleaning combo", "offers.cleanDesc": "Detergent, soap and household products.", "offers.drinksTitle": "Drinks combo", "offers.drinksDesc": "Juices, sodas and more.", "offers.see": "View combo", "offers.available": "Available now", "offers.seeAll": "See full catalog", "offers.empty": "No products available right now.", "combo.includes": "Includes", "combo.normal": "Regular price", "combo.save": "You save", "combo.comboPrice": "Combo price", "combo.add": "Add combo to cart", "combo.note": "The combo discount is applied by the store when confirming your order.", "catalog.title": "Products", "catalog.search": "Search products\u2026", "catalog.all": "All", "catalog.results": "products", "catalog.empty": "No results", "catalog.emptyHint": "Try another search or category.", "product.addToCart": "Add to cart", "product.inStock": "In stock", "product.outOfStock": "Out of stock", "product.noPhoto": "No photo", "product.back": "Back to catalog", "cart.title": "Your cart", "cart.empty": "Your cart is empty.", "cart.subtotal": "Subtotal", "cart.checkout": "Checkout", "cart.remove": "Remove", "cart.qty": "Qty", "checkout.title": "Checkout", "checkout.customer": "Your details", "checkout.name": "Name", "checkout.email": "Email (optional)", "checkout.destination": "Shipping destination", "checkout.usa": "United States", "checkout.cuba": "Cuba", "checkout.recipient": "Recipient name", "checkout.recipientPhone": "Recipient phone", "checkout.phone": "Phone", "checkout.address": "Address", "checkout.line2": "Apt / reference (optional)", "checkout.city": "City", "checkout.state": "State", "checkout.zip": "ZIP code", "checkout.province": "Province", "checkout.municipality": "Municipality", "checkout.ci": "ID card (optional)", "checkout.shipping": "Shipping", "checkout.total": "Total", "checkout.pay": "Pay", "checkout.placing": "Processing\u2026", "checkout.paySuccess": "Payment received! Your order is confirmed.", "checkout.pending": "Order created. The merchant will confirm it.", "checkout.stripeNote": "Secure card payment via Stripe.", "checkout.manualNote": "The merchant confirms your order after review.", "orders.title": "Orders", "orders.empty": "No orders.", "orders.search": "Search orders\u2026", "orders.status": "Status", "orders.total": "Total", "orders.revenue": "Revenue", "orders.pending": "Pending", "orders.confirmed": "Confirmed", "orders.totalCount": "Total", "orders.confirm": "Confirm", "orders.cancel": "Cancel", "orders.items": "items", "status.pending": "pending", "status.confirmed": "confirmed", "status.cancelled": "cancelled", "status.expired": "expired", "login.title": "Merchant panel", "login.merchant": "Access to manage orders.", "login.continue": "Continue with SSO", "common.loading": "Loading\u2026", "common.error": "Something went wrong.", "common.retry": "Retry", "wa.label": "Customer service on WhatsApp", "wa.cta": "Help" } };
function kt(e) {
  var _a;
  return (_a = tt[Ze()][e]) != null ? _a : e;
}

export { Ae as A, Be as B, Ee as E, F, Ge as G, Ne as N, Ze as Z, le as a, bt as b, ae as c, dt as d, at as e, ft as f, ct as g, ht as h, it as i, je as j, kt as k, lt as l, mt as m, nt as n, E as o, pt as p, qe as q, gt as r, st as s, B as t, ut as u, vt as v, yt as y };
//# sourceMappingURL=i18n-BOvpsPhe.mjs.map
