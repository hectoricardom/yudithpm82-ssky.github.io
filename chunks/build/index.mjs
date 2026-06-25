import { ssr, ssrHydrationKey, escape, createComponent, ssrStyleProperty, ssrAttribute } from 'solid-js/web';
import { k } from './index-BSDoL9aR.mjs';
import { createSignal, createResource, Show, For } from 'solid-js';
import { I } from './api-DqM-qoWO.mjs';
import { j as je, l as lt, k as kt } from './i18n-BOvpsPhe.mjs';
import { B as B$1, q as q$1 } from './PromoBanner-BVeDJqNk.mjs';
import './Money-BFVoQFsZ2.mjs';
import './ProductImage-BAkaKQC1.mjs';

var T = ["<p", ' class="-mb-2 text-sm text-muted"><!--$-->', "<!--/--> <!--$-->", "<!--/--></p>"], b = ["<div", ' class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">', "</div>"], j = ["<div", ' class="flex flex-col gap-6"><!--$-->', '<!--/--><section class="card relative overflow-hidden"><div class="aspect-[16/11] bg-cover bg-right bg-no-repeat sm:aspect-[16/6]" style="', '"></div><div class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:via-white/70"></div><div class="absolute inset-0 flex max-w-xl flex-col justify-center px-5 sm:px-10"><p class="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">Marquet \xB7 USA \u2192 Cuba</p><h1 class="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">', '</h1><p class="mt-2 max-w-md text-sm text-neutral-600 sm:text-base">', '</p><a href="/ofertas" class="btn-primary mt-4 w-fit px-5 py-2.5">', '</a></div></section><div class="grid grid-cols-1 gap-3 sm:grid-cols-3"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div><!--$-->", '<!--/--><div class="relative"><svg class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg><input type="search"', ' class="input pl-10"></div><div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden"><button type="button" class="', '">', "</button><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], q = ["<rect", ' x="1" y="3" width="15" height="13" rx="1.5"></rect>'], F = ["<path", ' d="M16 8h4l3 3v5h-7z"></path>'], R = ["<circle", ' cx="5.5" cy="18.5" r="1.6"></circle>'], z = ["<circle", ' cx="18.5" cy="18.5" r="1.6"></circle>'], B = ["<rect", ' x="3" y="11" width="18" height="11" rx="2"></rect>'], E = ["<path", ' d="M7 11V7a5 5 0 0 1 10 0v4"></path>'], H = ["<path", ' d="M3 18v-6a9 9 0 0 1 18 0v6"></path>'], U = ["<path", ' d="M21 19a2 2 0 0 1-2 2h-3M3 16a2 2 0 0 0 2 2h1v-5H4a1 1 0 0 0-1 1zM21 16a2 2 0 0 1-2 2h-1v-5h1a1 1 0 0 1 1 1z"></path>'], G = ["<button", ' type="button" class="', '">', "</button>"], K = ["<div", ' class="card flex flex-col items-center gap-1 py-20 text-center"><p class="font-display text-lg font-bold">', '</p><p class="text-sm text-muted">', "</p></div>"], N = ["<div", ' class="card flex items-center gap-3 p-4"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">', '</svg></span><div><div class="text-sm font-semibold">', '</div><div class="text-xs text-muted">', "</div></div></div>"], Q = ["<div", ' class="card overflow-hidden"><div class="skeleton aspect-square"></div><div class="flex flex-col gap-2 p-3"><div class="skeleton h-3.5 w-full rounded"></div><div class="skeleton h-3.5 w-2/3 rounded"></div><div class="skeleton mt-1 h-5 w-1/3 rounded"></div></div></div>'];
function at() {
  const l = je(), [g] = lt(), y = typeof g.category == "string" ? g.category : null, [o, I$1] = createSignal(y), [w, J] = createSignal(""), [h] = createResource(() => I.shop.categories()), $ = ["Alimentos", "Food", "Comida", "Despensa"], k$1 = () => {
    var _a, _b, _c;
    const i = (_a = h()) != null ? _a : [];
    return (_c = (_b = i.find((d) => $.includes(d.value))) != null ? _b : i[0]) != null ? _c : null;
  }, [n] = createResource(() => ({ category: o(), search: w().trim() }), ({ category: i, search: d }) => I.shop.products({ category: i != null ? i : void 0, search: d || void 0, limit: 48 })), m = () => {
    var _a, _b;
    return (_b = (_a = n()) == null ? void 0 : _a.items) != null ? _b : [];
  };
  return ssr(j, ssrHydrationKey(), escape(createComponent(k, { children: "Marquet \u2014 Compra desde USA, entrega en Cuba" })), ssrStyleProperty("background-image:", "url(/img/hero.jpg)"), escape(kt("hero.title")), escape(kt("hero.subtitle")), escape(kt("hero.cta")), escape(createComponent(p, { get title() {
    return kt("feat.shipTitle");
  }, get desc() {
    return kt("feat.shipDesc");
  }, get icon() {
    return [ssr(q, ssrHydrationKey()), ssr(F, ssrHydrationKey()), ssr(R, ssrHydrationKey()), ssr(z, ssrHydrationKey())];
  } })), escape(createComponent(p, { get title() {
    return kt("feat.payTitle");
  }, get desc() {
    return kt("feat.payDesc");
  }, get icon() {
    return [ssr(B, ssrHydrationKey()), ssr(E, ssrHydrationKey())];
  } })), escape(createComponent(p, { get title() {
    return kt("feat.supportTitle");
  }, get desc() {
    return kt("feat.supportDesc");
  }, get icon() {
    return [ssr(H, ssrHydrationKey()), ssr(U, ssrHydrationKey())];
  } })), escape(createComponent(Show, { get when() {
    return k$1();
  }, get children() {
    return createComponent(B$1, { get eyebrow() {
      return kt("promo.eyebrow");
    }, get title() {
      return kt("promo.title");
    }, get subtitle() {
      return kt("promo.subtitle");
    }, get cta() {
      return kt("promo.cta");
    }, onClick: () => l("/ofertas") });
  } })), ssrAttribute("placeholder", escape(kt("catalog.search"), true), false), `pill ${o() === null ? "bg-ink text-white border-ink" : ""} ${o() !== null ? "border-line bg-white text-muted hover:text-ink" : ""}`, escape(kt("catalog.all")), escape(createComponent(For, { get each() {
    var _a;
    return (_a = h()) != null ? _a : [];
  }, children: (i) => ssr(G, ssrHydrationKey(), `pill ${o() === i.value ? "bg-ink text-white border-ink" : ""} ${o() !== i.value ? "border-line bg-white text-muted hover:text-ink" : ""}`, escape(i.label)) })), escape(createComponent(Show, { get when() {
    return !n.loading && n();
  }, get children() {
    return ssr(T, ssrHydrationKey(), escape(n().total), escape(kt("catalog.results")));
  } })), escape(createComponent(Show, { get when() {
    return !n.loading;
  }, get fallback() {
    return createComponent(V, {});
  }, get children() {
    return createComponent(Show, { get when() {
      return m().length > 0;
    }, get fallback() {
      return ssr(K, ssrHydrationKey(), escape(kt("catalog.empty")), escape(kt("catalog.emptyHint")));
    }, get children() {
      return ssr(b, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return m();
      }, children: (i) => createComponent(q$1, { product: i }) })));
    } });
  } })));
}
function p(l) {
  return ssr(N, ssrHydrationKey(), escape(l.icon), escape(l.title), escape(l.desc));
}
function V() {
  return ssr(b, ssrHydrationKey(), escape(createComponent(For, { get each() {
    return Array.from({ length: 8 });
  }, children: () => ssr(Q, ssrHydrationKey()) })));
}

export { at as default };
//# sourceMappingURL=index.mjs.map
