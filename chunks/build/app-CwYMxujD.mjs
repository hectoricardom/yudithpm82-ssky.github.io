import { createComponent, ssr, ssrHydrationKey, escape, isServer, ssrAttribute, getRequestEvent, delegateEvents } from 'solid-js/web';
import { c as au } from '../../index.mjs';
import { onMount, ErrorBoundary, Suspense, createSignal, Show, onCleanup, For, children, createMemo, getOwner, sharedConfig, untrack, on, createRoot } from 'solid-js';
import { v as vt$1, b as bt$1, k as kt$1, m as mt, Z as Ze, q as qe, d as dt, N as Ne, E as Ee, u as ut, f as ft, F as F$1, a as le, n as nt, c as ae, A as Ae, e as at } from './i18n-BOvpsPhe.mjs';
import { m, g } from './cart-Dae0Y9sg.mjs';
import { E } from './api-Cva_LdRg.mjs';
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

const K = (t) => (r) => {
  const { base: n } = r, a = children(() => r.children), e = createMemo(() => qe(a(), r.base || ""));
  let i;
  const c = dt(t, e, () => i, { base: n, singleFlight: r.singleFlight, transformUrl: r.transformUrl });
  return t.create && t.create(c), createComponent(Ne.Provider, { value: c, get children() {
    return createComponent(gt, { routerState: c, get root() {
      return r.root;
    }, get preload() {
      return r.rootPreload || r.rootLoad;
    }, get children() {
      return [(i = getOwner()) && null, createComponent(pt, { routerState: c, get branches() {
        return e();
      } })];
    } });
  } });
};
function gt(t) {
  const r = t.routerState.location, n = t.routerState.params, a = createMemo(() => t.preload && untrack(() => {
    t.preload({ params: n, location: r, intent: ut() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (e) => createComponent(e, { params: n, location: r, get data() {
    return a();
  }, get children() {
    return t.children;
  } }) });
}
function pt(t) {
  if (isServer) {
    const e = getRequestEvent();
    if (e && e.router && e.router.dataOnly) {
      bt(e, t.routerState, t.branches);
      return;
    }
    e && ((e.router || (e.router = {})).matches || (e.router.matches = t.routerState.matches().map(({ route: i, path: c, params: x }) => ({ path: i.originalPath, pattern: i.pattern, match: c, params: x, info: i.info }))));
  }
  const r = [];
  let n;
  const a = createMemo(on(t.routerState.matches, (e, i, c) => {
    let x = i && e.length === i.length;
    const p = [];
    for (let h = 0, y = e.length; h < y; h++) {
      const k = i && i[h], v = e[h];
      c && k && v.route.key === k.route.key ? p[h] = c[h] : (x = false, r[h] && r[h](), createRoot((S) => {
        r[h] = S, p[h] = ft(t.routerState, p[h - 1] || t.routerState.base, F(() => a()[h + 1]), () => {
          var _a;
          const $ = t.routerState.matches();
          return (_a = $[h]) != null ? _a : $[0];
        });
      }));
    }
    return r.splice(e.length).forEach((h) => h()), c && x ? c : (n = p[0], p);
  }));
  return F(() => a() && n)();
}
const F = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (r) => createComponent(le.Provider, { value: r, get children() {
  return r.outlet();
} }) });
function bt(t, r, n) {
  const a = new URL(t.request.url), e = F$1(n, new URL(t.router.previousUrl || t.request.url).pathname), i = F$1(n, a.pathname);
  for (let c = 0; c < i.length; c++) {
    (!e[c] || i[c].route !== e[c].route) && (t.router.dataOnly = true);
    const { route: x, params: p } = i[c];
    x.preload && x.preload({ params: p, location: r.location, intent: "preload" });
  }
}
function xt([t, r], n, a) {
  return [t, a ? (e) => r(a(e)) : r];
}
function wt(t) {
  let r = false;
  const n = (e) => typeof e == "string" ? { value: e } : e, a = xt(createSignal(n(t.get()), { equals: (e, i) => e.value === i.value && e.state === i.state }), void 0, (e) => (!r && t.set(e), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), e));
  return t.init && onCleanup(t.init((e = t.get()) => {
    r = true, a[1](n(e)), r = false;
  })), K({ signal: a, create: t.create, utils: t.utils });
}
function vt(t, r, n) {
  return t.addEventListener(r, n), () => t.removeEventListener(r, n);
}
function yt(t, r) {
  const n = t && document.getElementById(t);
  n ? n.scrollIntoView() : r && window.scrollTo(0, 0);
}
function kt(t) {
  const r = new URL(t);
  return r.pathname + r.search;
}
function $t(t) {
  let r;
  const n = { value: t.url || (r = getRequestEvent()) && kt(r.request.url) || "" };
  return K({ signal: [() => n, (a) => Object.assign(n, a)] })(t);
}
const Rt = /* @__PURE__ */ new Map();
function Lt(t = true, r = false, n = "/_server", a) {
  return (e) => {
    const i = e.base.path(), c = e.navigatorFactory(e.base);
    let x, p;
    function h(o) {
      return o.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function y(o) {
      if (o.defaultPrevented || o.button !== 0 || o.metaKey || o.altKey || o.ctrlKey || o.shiftKey) return;
      const s = o.composedPath().find((O) => O instanceof Node && O.nodeName.toUpperCase() === "A");
      if (!s || r && !s.hasAttribute("link")) return;
      const m = h(s), d = m ? s.href.baseVal : s.href;
      if ((m ? s.target.baseVal : s.target) || !d && !s.hasAttribute("state")) return;
      const R = (s.getAttribute("rel") || "").split(/\s+/);
      if (s.hasAttribute("download") || R && R.includes("external")) return;
      const A = m ? new URL(d, document.baseURI) : new URL(d);
      if (!(A.origin !== window.location.origin || i && A.pathname && !A.pathname.toLowerCase().startsWith(i.toLowerCase()))) return [s, A];
    }
    function k(o) {
      const s = y(o);
      if (!s) return;
      const [m, d] = s, P = e.parsePath(d.pathname + d.search + d.hash), R = m.getAttribute("state");
      o.preventDefault(), c(P, { resolve: false, replace: m.hasAttribute("replace"), scroll: !m.hasAttribute("noscroll"), state: R ? JSON.parse(R) : void 0 });
    }
    function v(o) {
      const s = y(o);
      if (!s) return;
      const [m, d] = s;
      a && (d.pathname = a(d.pathname)), e.preloadRoute(d, m.getAttribute("preload") !== "false");
    }
    function S(o) {
      clearTimeout(x);
      const s = y(o);
      if (!s) return p = null;
      const [m, d] = s;
      p !== m && (a && (d.pathname = a(d.pathname)), x = setTimeout(() => {
        e.preloadRoute(d, m.getAttribute("preload") !== "false"), p = m;
      }, 20));
    }
    function $(o) {
      if (o.defaultPrevented) return;
      let s = o.submitter && o.submitter.hasAttribute("formaction") ? o.submitter.getAttribute("formaction") : o.target.getAttribute("action");
      if (!s) return;
      if (!s.startsWith("https://action/")) {
        const d = new URL(s, Ee);
        if (s = e.parsePath(d.pathname + d.search), !s.startsWith(n)) return;
      }
      if (o.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const m = Rt.get(s);
      if (m) {
        o.preventDefault();
        const d = new FormData(o.target, o.submitter);
        m.call({ r: e, f: o.target }, o.target.enctype === "multipart/form-data" ? d : new URLSearchParams(d));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", k), t && (document.addEventListener("mousemove", S, { passive: true }), document.addEventListener("focusin", v, { passive: true }), document.addEventListener("touchstart", v, { passive: true })), document.addEventListener("submit", $), onCleanup(() => {
      document.removeEventListener("click", k), t && (document.removeEventListener("mousemove", S), document.removeEventListener("focusin", v), document.removeEventListener("touchstart", v)), document.removeEventListener("submit", $);
    });
  };
}
function St(t) {
  if (isServer) return $t(t);
  const r = () => {
    const a = window.location.pathname.replace(/^\/+/, "/") + window.location.search, e = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: a + window.location.hash, state: e };
  }, n = Ae();
  return wt({ get: r, set({ value: a, replace: e, scroll: i, state: c }) {
    e ? window.history.replaceState(nt(c), "", a) : window.history.pushState(c, "", a), yt(decodeURIComponent(window.location.hash.slice(1)), i), ae();
  }, init: (a) => vt(window, "popstate", at(a, (e) => {
    if (e) return !n.confirm(e);
    {
      const i = r();
      return !n.confirm(i.value, { state: i.state });
    }
  })), create: Lt(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (a) => window.history.go(a), beforeLeave: n } })(t);
}
var At = ["<div", ' class="relative bg-brand-dark text-white"><div class="mx-auto flex max-w-6xl items-center justify-center px-8 py-2 text-center text-xs font-medium sm:text-sm"><!--$-->', '<!--/--><button type="button" aria-label="Cerrar" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">\u2715</button></div></div>'];
const Ct = { es: "\u{1F1E8}\u{1F1FA} Env\xEDo a toda Cuba \xB7 Pedidos confirmados hoy salen primero", en: "\u{1F1E8}\u{1F1FA} Delivery across Cuba \xB7 Orders confirmed today ship first" };
function Et() {
  return Ze(), Ct[Ze()];
}
const Ut = "announce_dismissed";
function _t() {
  const [t, r] = createSignal(typeof sessionStorage < "u" && sessionStorage.getItem(Ut) === "1");
  return createComponent(Show, { get when() {
    return !t();
  }, get children() {
    return ssr(At, ssrHydrationKey(), escape(Et()));
  } });
}
var Pt = ["<div", ' class="flex items-center rounded-lg border border-line bg-white p-0.5 text-xs font-semibold">', "</div>"], Ot = ["<button", ' type="button" class="', '">', "</button>"];
function jt() {
  const t = ["es", "en"];
  return ssr(Pt, ssrHydrationKey(), escape(createComponent(For, { each: t, children: (r) => ssr(Ot, ssrHydrationKey(), `rounded-md px-2 py-1 uppercase transition-colors ${Ze() === r ? "bg-brand text-white" : ""} ${Ze() !== r ? "text-muted hover:text-ink" : ""}`, escape(r)) })));
}
var Bt = ["<span", ' class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-display text-base font-extrabold text-white">M</span>'], Dt = ["<span", ' class="font-display text-xl font-extrabold tracking-tight">Marquet</span>'], Ft = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2.5 3.5h2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6"></path></svg>'], Mt = ["<span", ' class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">', "</span>"], qt = ["<button", ' type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink">', "</button>"], It = ["<header", ' class="sticky top-0 z-20 border-b border-line bg-white/80 backdrop-blur-md"><div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4"><!--$-->', '<!--/--><nav class="ml-auto flex items-center gap-1 sm:gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></nav></div></header>"];
function Tt() {
  return ssr(It, ssrHydrationKey(), escape(createComponent(E, { href: "/", class: "flex items-center gap-2", end: true, get children() {
    return [ssr(Bt, ssrHydrationKey()), ssr(Dt, ssrHydrationKey())];
  } })), escape(createComponent(E, { href: "/ofertas", class: "hidden rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-tint sm:block", get children() {
    return kt$1("nav.offers");
  } })), escape(createComponent(Show, { get when() {
    return mt();
  }, get children() {
    return createComponent(E, { href: "/orders", class: "hidden rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink sm:block", get children() {
      return kt$1("nav.orders");
    } });
  } })), escape(createComponent(E, { href: "/cart", class: "relative flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-canvas", get "aria-label"() {
    return kt$1("nav.cart");
  }, get children() {
    return [ssr(Ft, ssrHydrationKey()), createComponent(Show, { get when() {
      return g() > 0;
    }, get children() {
      return ssr(Mt, ssrHydrationKey(), escape(g()));
    } })];
  } })), escape(createComponent(jt, {})), escape(createComponent(Show, { get when() {
    return mt();
  }, get fallback() {
    return createComponent(E, { href: "/login", class: "btn-ghost px-3 py-2", get children() {
      return kt$1("nav.login");
    } });
  }, get children() {
    return ssr(qt, ssrHydrationKey(), escape(kt$1("nav.logout")));
  } })));
}
var Ht = ["<a", ' target="_blank" rel="noopener noreferrer"', ' class="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg><span class="hidden text-sm font-semibold sm:inline">', "</span></a>"];
const M = "13055551234".replace(/\D/g, ""), Kt = "Hola, necesito ayuda con un pedido.";
function Nt() {
  const t = () => `https://wa.me/${M}?text=${encodeURIComponent(Kt)}`;
  return createComponent(Show, { when: M, get children() {
    return ssr(Ht, ssrHydrationKey() + ssrAttribute("href", escape(t(), true), false), ssrAttribute("aria-label", escape(kt$1("wa.label"), true), false) + ssrAttribute("title", escape(kt$1("wa.label"), true), false), escape(kt$1("wa.cta")));
  } });
}
var zt = ["<div", ' class="min-h-screen flex flex-col"><!--$-->', "<!--/--><!--$-->", '<!--/--><main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">', '</main><footer class="border-t border-line bg-white"><div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted"><span class="font-display font-bold text-ink">Marquet</span><span>\xA9 2026 \xB7 USA \u2192 Cuba</span></div></footer><!--$-->', "<!--/--></div>"], Wt = ["<div", ' class="flex flex-col items-center gap-3 py-24 text-center"><p class="text-muted">', '</p><button type="button" class="btn-ghost px-4 py-2">', "</button></div>"], Vt = ["<div", ' class="py-24 text-center text-muted">', "</div>"];
function ne() {
  return onMount(() => {
    vt$1(), m(), bt$1();
  }), createComponent(St, { root: (t) => ssr(zt, ssrHydrationKey(), escape(createComponent(_t, {})), escape(createComponent(Tt, {})), escape(createComponent(ErrorBoundary, { fallback: (r, n) => ssr(Wt, ssrHydrationKey(), escape(kt$1("common.error")), escape(kt$1("common.retry"))), get children() {
    return createComponent(Suspense, { get fallback() {
      return ssr(Vt, ssrHydrationKey(), escape(kt$1("common.loading")));
    }, get children() {
      return t.children;
    } });
  } })), escape(createComponent(Nt, {}))), get children() {
    return createComponent(au, {});
  } });
}

export { ne as default };
//# sourceMappingURL=app-CwYMxujD.mjs.map
