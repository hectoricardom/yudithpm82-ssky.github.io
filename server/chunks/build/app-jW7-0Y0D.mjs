import { createComponent, ssr, ssrHydrationKey, escape, isServer, ssrAttribute, getRequestEvent, delegateEvents } from 'solid-js/web';
import { I, k, H } from './index-BSDoL9aR.mjs';
import { c as au } from '../../index.mjs';
import { onMount, ErrorBoundary, Suspense, createSignal, Show, onCleanup, For, children, createMemo, getOwner, sharedConfig, untrack, on, createRoot } from 'solid-js';
import { v as vt, b as bt, k as kt, m as mt, Z as Ze, q as qe$1, d as dt, N as Ne$1, E as Ee$1, u as ut, f as ft, F, a as le, n as nt, c as ae, A as Ae$1, e as at } from './i18n-BOvpsPhe.mjs';
import { m, g } from './cart-Bgs-B906.mjs';
import { U } from './api-CoAX2wNl.mjs';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';

const K = (e) => (r) => {
  const { base: n } = r, a = children(() => r.children), t = createMemo(() => qe$1(a(), r.base || ""));
  let l;
  const c = dt(e, t, () => l, { base: n, singleFlight: r.singleFlight, transformUrl: r.transformUrl });
  return e.create && e.create(c), createComponent(Ne$1.Provider, { value: c, get children() {
    return createComponent(xe, { routerState: c, get root() {
      return r.root;
    }, get preload() {
      return r.rootPreload || r.rootLoad;
    }, get children() {
      return [(l = getOwner()) && null, createComponent(we, { routerState: c, get branches() {
        return t();
      } })];
    } });
  } });
};
function xe(e) {
  const r = e.routerState.location, n = e.routerState.params, a = createMemo(() => e.preload && untrack(() => {
    e.preload({ params: n, location: r, intent: ut() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (t) => createComponent(t, { params: n, location: r, get data() {
    return a();
  }, get children() {
    return e.children;
  } }) });
}
function we(e) {
  if (isServer) {
    const t = getRequestEvent();
    if (t && t.router && t.router.dataOnly) {
      ve(t, e.routerState, e.branches);
      return;
    }
    t && ((t.router || (t.router = {})).matches || (t.router.matches = e.routerState.matches().map(({ route: l, path: c, params: x }) => ({ path: l.originalPath, pattern: l.pattern, match: c, params: x, info: l.info }))));
  }
  const r = [];
  let n;
  const a = createMemo(on(e.routerState.matches, (t, l, c) => {
    let x = l && t.length === l.length;
    const p = [];
    for (let h = 0, y = t.length; h < y; h++) {
      const k = l && l[h], v = t[h];
      c && k && v.route.key === k.route.key ? p[h] = c[h] : (x = false, r[h] && r[h](), createRoot((L) => {
        r[h] = L, p[h] = ft(e.routerState, p[h - 1] || e.routerState.base, T(() => a()[h + 1]), () => {
          var _a;
          const $ = e.routerState.matches();
          return (_a = $[h]) != null ? _a : $[0];
        });
      }));
    }
    return r.splice(t.length).forEach((h) => h()), c && x ? c : (n = p[0], p);
  }));
  return T(() => a() && n)();
}
const T = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (r) => createComponent(le.Provider, { value: r, get children() {
  return r.outlet();
} }) });
function ve(e, r, n) {
  const a = new URL(e.request.url), t = F(n, new URL(e.router.previousUrl || e.request.url).pathname), l = F(n, a.pathname);
  for (let c = 0; c < l.length; c++) {
    (!t[c] || l[c].route !== t[c].route) && (e.router.dataOnly = true);
    const { route: x, params: p } = l[c];
    x.preload && x.preload({ params: p, location: r.location, intent: "preload" });
  }
}
function ye([e, r], n, a) {
  return [e, a ? (t) => r(a(t)) : r];
}
function ke(e) {
  let r = false;
  const n = (t) => typeof t == "string" ? { value: t } : t, a = ye(createSignal(n(e.get()), { equals: (t, l) => t.value === l.value && t.state === l.state }), void 0, (t) => (!r && e.set(t), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), t));
  return e.init && onCleanup(e.init((t = e.get()) => {
    r = true, a[1](n(t)), r = false;
  })), K({ signal: a, create: e.create, utils: e.utils });
}
function $e(e, r, n) {
  return e.addEventListener(r, n), () => e.removeEventListener(r, n);
}
function Re(e, r) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : r && window.scrollTo(0, 0);
}
function Se(e) {
  const r = new URL(e);
  return r.pathname + r.search;
}
function Le(e) {
  let r;
  const n = { value: e.url || (r = getRequestEvent()) && Se(r.request.url) || "" };
  return K({ signal: [() => n, (a) => Object.assign(n, a)] })(e);
}
const Ae = /* @__PURE__ */ new Map();
function Ce(e = true, r = false, n = "/_server", a) {
  return (t) => {
    const l = t.base.path(), c = t.navigatorFactory(t.base);
    let x, p;
    function h(s) {
      return s.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function y(s) {
      if (s.defaultPrevented || s.button !== 0 || s.metaKey || s.altKey || s.ctrlKey || s.shiftKey) return;
      const i = s.composedPath().find((M) => M instanceof Node && M.nodeName.toUpperCase() === "A");
      if (!i || r && !i.hasAttribute("link")) return;
      const m = h(i), d = m ? i.href.baseVal : i.href;
      if ((m ? i.target.baseVal : i.target) || !d && !i.hasAttribute("state")) return;
      const R = (i.getAttribute("rel") || "").split(/\s+/);
      if (i.hasAttribute("download") || R && R.includes("external")) return;
      const A = m ? new URL(d, document.baseURI) : new URL(d);
      if (!(A.origin !== window.location.origin || l && A.pathname && !A.pathname.toLowerCase().startsWith(l.toLowerCase()))) return [i, A];
    }
    function k(s) {
      const i = y(s);
      if (!i) return;
      const [m, d] = i, _ = t.parsePath(d.pathname + d.search + d.hash), R = m.getAttribute("state");
      s.preventDefault(), c(_, { resolve: false, replace: m.hasAttribute("replace"), scroll: !m.hasAttribute("noscroll"), state: R ? JSON.parse(R) : void 0 });
    }
    function v(s) {
      const i = y(s);
      if (!i) return;
      const [m, d] = i;
      a && (d.pathname = a(d.pathname)), t.preloadRoute(d, m.getAttribute("preload") !== "false");
    }
    function L(s) {
      clearTimeout(x);
      const i = y(s);
      if (!i) return p = null;
      const [m, d] = i;
      p !== m && (a && (d.pathname = a(d.pathname)), x = setTimeout(() => {
        t.preloadRoute(d, m.getAttribute("preload") !== "false"), p = m;
      }, 20));
    }
    function $(s) {
      if (s.defaultPrevented) return;
      let i = s.submitter && s.submitter.hasAttribute("formaction") ? s.submitter.getAttribute("formaction") : s.target.getAttribute("action");
      if (!i) return;
      if (!i.startsWith("https://action/")) {
        const d = new URL(i, Ee$1);
        if (i = t.parsePath(d.pathname + d.search), !i.startsWith(n)) return;
      }
      if (s.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const m = Ae.get(i);
      if (m) {
        s.preventDefault();
        const d = new FormData(s.target, s.submitter);
        m.call({ r: t, f: s.target }, s.target.enctype === "multipart/form-data" ? d : new URLSearchParams(d));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", k), e && (document.addEventListener("mousemove", L, { passive: true }), document.addEventListener("focusin", v, { passive: true }), document.addEventListener("touchstart", v, { passive: true })), document.addEventListener("submit", $), onCleanup(() => {
      document.removeEventListener("click", k), e && (document.removeEventListener("mousemove", L), document.removeEventListener("focusin", v), document.removeEventListener("touchstart", v)), document.removeEventListener("submit", $);
    });
  };
}
function Ee(e) {
  if (isServer) return Le(e);
  const r = () => {
    const a = window.location.pathname.replace(/^\/+/, "/") + window.location.search, t = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: a + window.location.hash, state: t };
  }, n = Ae$1();
  return ke({ get: r, set({ value: a, replace: t, scroll: l, state: c }) {
    t ? window.history.replaceState(nt(c), "", a) : window.history.pushState(c, "", a), Re(decodeURIComponent(window.location.hash.slice(1)), l), ae();
  }, init: (a) => $e(window, "popstate", at(a, (t) => {
    if (t) return !n.confirm(t);
    {
      const l = r();
      return !n.confirm(l.value, { state: l.state });
    }
  })), create: Ce(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (a) => window.history.go(a), beforeLeave: n } })(e);
}
var Ue = ["<div", ' class="relative bg-brand-dark text-white"><div class="mx-auto flex max-w-6xl items-center justify-center px-8 py-2 text-center text-xs font-medium sm:text-sm"><!--$-->', '<!--/--><button type="button" aria-label="Cerrar" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">\u2715</button></div></div>'];
const Pe = { es: "\u{1F1E8}\u{1F1FA} Env\xEDo a toda Cuba \xB7 Pedidos confirmados hoy salen primero", en: "\u{1F1E8}\u{1F1FA} Delivery across Cuba \xB7 Orders confirmed today ship first" };
function _e() {
  return Ze(), Pe[Ze()];
}
const Me = "announce_dismissed";
function Oe() {
  const [e, r] = createSignal(typeof sessionStorage < "u" && sessionStorage.getItem(Me) === "1");
  return createComponent(Show, { get when() {
    return !e();
  }, get children() {
    return ssr(Ue, ssrHydrationKey(), escape(_e()));
  } });
}
var je = ["<div", ' class="flex items-center rounded-lg border border-line bg-white p-0.5 text-xs font-semibold">', "</div>"], Be = ["<button", ' type="button" class="', '">', "</button>"];
function Te() {
  const e = ["es", "en"];
  return ssr(je, ssrHydrationKey(), escape(createComponent(For, { each: e, children: (r) => ssr(Be, ssrHydrationKey(), `rounded-md px-2 py-1 uppercase transition-colors ${Ze() === r ? "bg-brand text-white" : ""} ${Ze() !== r ? "text-muted hover:text-ink" : ""}`, escape(r)) })));
}
var qe = ["<span", ' class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-base font-extrabold text-white">M</span>'], De = ["<span", ' class="font-display text-xl font-extrabold tracking-tight">Marquet</span>'], Fe = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2.5 3.5h2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"></path></svg>'], Ie = ["<span", ' class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">', "</span>"], He = ["<button", ' type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink">', "</button>"], Ke = ["<header", ' class="sticky top-0 z-20 border-b border-line bg-white/80 backdrop-blur-md"><div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4"><!--$-->', '<!--/--><nav class="ml-auto flex items-center gap-1 sm:gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></nav></div></header>"];
function Ne() {
  return ssr(Ke, ssrHydrationKey(), escape(createComponent(U, { href: "/", class: "flex items-center gap-2", end: true, get children() {
    return [ssr(qe, ssrHydrationKey()), ssr(De, ssrHydrationKey())];
  } })), escape(createComponent(U, { href: "/ofertas", class: "hidden rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-tint sm:block", get children() {
    return kt("nav.offers");
  } })), escape(createComponent(Show, { get when() {
    return mt();
  }, get children() {
    return createComponent(U, { href: "/orders", class: "hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink sm:block", get children() {
      return kt("nav.orders");
    } });
  } })), escape(createComponent(U, { href: "/cart", class: "relative flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-canvas", get "aria-label"() {
    return kt("nav.cart");
  }, get children() {
    return [ssr(Fe, ssrHydrationKey()), createComponent(Show, { get when() {
      return g() > 0;
    }, get children() {
      return ssr(Ie, ssrHydrationKey(), escape(g()));
    } })];
  } })), escape(createComponent(Te, {})), escape(createComponent(Show, { get when() {
    return mt();
  }, get fallback() {
    return createComponent(U, { href: "/login", class: "btn-ghost px-3 py-2", get children() {
      return kt("nav.login");
    } });
  }, get children() {
    return ssr(He, ssrHydrationKey(), escape(kt("nav.logout")));
  } })));
}
var ze = ["<a", ' target="_blank" rel="noopener noreferrer"', ' class="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg><span class="hidden text-sm font-semibold sm:inline">', "</span></a>"];
const q = "13055551234".replace(/\D/g, ""), We = "Hola, necesito ayuda con un pedido.";
function Ve() {
  const e = () => `https://wa.me/${q}?text=${encodeURIComponent(We)}`;
  return createComponent(Show, { when: q, get children() {
    return ssr(ze, ssrHydrationKey() + ssrAttribute("href", escape(e(), true), false), ssrAttribute("aria-label", escape(kt("wa.label"), true), false) + ssrAttribute("title", escape(kt("wa.label"), true), false), escape(kt("wa.cta")));
  } });
}
var Ge = ["<div", ' class="min-h-screen flex flex-col"><!--$-->', "<!--/--><!--$-->", '<!--/--><main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">', '</main><footer class="border-t border-line bg-white"><div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted"><span class="font-display font-bold text-ink">Marquet</span><span>\xA9 2026 \xB7 USA \u2192 Cuba</span></div></footer><!--$-->', "<!--/--></div>"], Je = ["<div", ' class="flex flex-col items-center gap-3 py-24 text-center"><p class="text-muted">', '</p><button type="button" class="btn-ghost px-4 py-2">', "</button></div>"], Ye = ["<div", ' class="py-24 text-center text-muted">', "</div>"];
function it() {
  return onMount(() => {
    vt(), m(), bt();
  }), createComponent(Ee, { root: (e) => createComponent(I, { get children() {
    return [createComponent(k, { children: "Marquet \u2014 Compra desde USA, entrega en Cuba" }), createComponent(H, { name: "description", content: "Tienda online para enviar alimentos, aseo y productos del hogar a tu familia en Cuba. Compra desde USA con entrega a domicilio." }), ssr(Ge, ssrHydrationKey(), escape(createComponent(Oe, {})), escape(createComponent(Ne, {})), escape(createComponent(ErrorBoundary, { fallback: (r, n) => ssr(Je, ssrHydrationKey(), escape(kt("common.error")), escape(kt("common.retry"))), get children() {
      return createComponent(Suspense, { get fallback() {
        return ssr(Ye, ssrHydrationKey(), escape(kt("common.loading")));
      }, get children() {
        return e.children;
      } });
    } })), escape(createComponent(Ve, {})))];
  } }), get children() {
    return createComponent(au, {});
  } });
}

export { it as default };
//# sourceMappingURL=app-jW7-0Y0D.mjs.map
