import { createComponent, ssr, ssrHydrationKey, escape, ssrStyleProperty, ssrAttribute } from 'solid-js/web';
import { createMemo, createSignal, createResource, Show, For } from 'solid-js';
import { i as it, j as je, a as I$1, E, k as kt, p } from '../../index.mjs';
import { s } from './combos-Dyt9v_Yz.mjs';
import { e } from './Money-BFVoQFsZ.mjs';
import { g } from './ProductImage-DdC0ohbV.mjs';
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

var q = ["<div", ' class="py-20 text-center text-muted">', "</div>"], z = ["<div", ' class="absolute inset-0 bg-cover bg-right bg-no-repeat" style="', '"></div>'], B = ["<div", ' class="', '"></div>'], F = ["<div", ' class="grid gap-6 lg:grid-cols-3"><div class="lg:col-span-2"><h2 class="mb-3 font-display text-lg font-bold tracking-tight"><!--$-->', "<!--/--> (<!--$-->", '<!--/-->)</h2><div class="card divide-y divide-line">', '</div></div><aside class="card sticky top-20 flex h-fit flex-col gap-3 p-5"><div class="flex justify-between text-sm"><span class="text-muted">', '</span><span class="text-muted line-through">', '</span></div><div class="flex items-center justify-between text-sm"><span class="font-medium text-brand">', '</span><span class="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">\u2212<!--$-->', '<!--/--></span></div><div class="flex items-baseline justify-between border-t border-line pt-3"><span class="font-semibold">', '</span><span class="font-display text-2xl font-extrabold tracking-tight">', '</span></div><button type="button"', ' class="btn-primary py-3.5">', '</button><p class="text-xs text-muted">', "</p></aside></div>"], H = ["<div", ' class="flex flex-col gap-6"><!--$-->', '<!--/--><section class="', '"><!--$-->', '<!--/--><div class="relative z-10 max-w-md px-5 py-8 sm:px-8 sm:py-12"><p class="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"><!--$-->', "<!--/--> \xB7 \u2212<!--$-->", '<!--/-->%</p><h1 class="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">', '</h1><p class="mt-1 text-sm text-white/80">', "</p></div></section><!--$-->", "<!--/--></div>"], I = ["<div", ' class="py-16 text-center text-muted">', "</div>"], M = ["<div", ' class="card py-16 text-center text-muted">', "</div>"], N = ["<div", ' class="h-12 w-12 shrink-0 overflow-hidden rounded-lg">', "</div>"], R = ["<span", ' class="line-clamp-1 flex-1 text-sm font-medium">', "</span>"], T = ["<span", ' class="text-sm text-muted">', "</span>"];
function Y() {
  const v = it();
  je();
  const d = createMemo(() => {
    var _a;
    return s((_a = v.combo) != null ? _a : "");
  }), [u, U] = createSignal(false), [o] = createResource(() => d(), async (e) => {
    var _a, _b;
    const a = await I$1.shop.categories(), f = (_b = e.categories.find((p) => a.some((y) => y.value === p))) != null ? _b : (_a = a[0]) == null ? void 0 : _a.value;
    return f ? (await I$1.shop.products({ category: f, limit: 48 })).items.filter((p) => p.inStock).slice(0, e.itemCount) : [];
  }), m = () => {
    var _a;
    return ((_a = o()) != null ? _a : []).reduce((e, a) => e + a.price, 0);
  }, g$1 = () => {
    var _a, _b;
    return m() * (1 - ((_b = (_a = d()) == null ? void 0 : _a.discountPct) != null ? _b : 0) / 100);
  }, h = () => m() - g$1();
  return createComponent(Show, { get when() {
    return d();
  }, get fallback() {
    return ssr(q, ssrHydrationKey(), escape(kt("common.error")));
  }, children: (e$1) => ssr(H, ssrHydrationKey(), escape(createComponent(E, { href: "/ofertas", class: "inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink", get children() {
    return ["\u2190 ", kt("nav.offers")];
  } })), `card relative overflow-hidden text-white ${e$1().variant !== "dark" ? "bg-brand" : ""} ${e$1().variant === "dark" ? "bg-ink" : ""}`, escape(createComponent(Show, { get when() {
    return e$1().image;
  }, get children() {
    return [ssr(z, ssrHydrationKey(), ssrStyleProperty("background-image:", `url(${escape(e$1().image, true)})`)), ssr(B, ssrHydrationKey(), `absolute inset-0 ${e$1().variant !== "dark" ? "bg-gradient-to-r from-brand via-brand/90 to-brand/20" : ""} ${e$1().variant === "dark" ? "bg-gradient-to-r from-ink via-ink/90 to-ink/20" : ""}`)];
  } })), escape(kt("offers.combo")), escape(e$1().discountPct), escape(kt(e$1().titleKey)), escape(kt(e$1().descKey)), escape(createComponent(Show, { get when() {
    return !o.loading;
  }, get fallback() {
    return ssr(I, ssrHydrationKey(), escape(kt("common.loading")));
  }, get children() {
    return createComponent(Show, { get when() {
      var _a;
      return ((_a = o()) != null ? _a : []).length > 0;
    }, get fallback() {
      return ssr(M, ssrHydrationKey(), escape(kt("offers.empty")));
    }, get children() {
      var _a;
      return ssr(F, ssrHydrationKey(), escape(kt("combo.includes")), escape(((_a = o()) != null ? _a : []).length), escape(createComponent(For, { get each() {
        return o();
      }, children: (a) => createComponent(E, { get href() {
        return `/product/${a.id}`;
      }, class: "flex items-center gap-3 p-3 hover:bg-canvas", get children() {
        return [ssr(N, ssrHydrationKey(), escape(createComponent(g, { get name() {
          return a.name;
        }, get image() {
          return a.image;
        }, class: "h-full w-full", markClass: "h-6 w-6 text-[10px]", caption: false }))), ssr(R, ssrHydrationKey(), escape(a.name)), ssr(T, ssrHydrationKey(), escape(e(a.price)))];
      } }) })), escape(kt("combo.normal")), escape(e(m())), escape(kt("combo.save")), escape(e(h())), escape(kt("combo.comboPrice")), escape(e(g$1())), ssrAttribute("disabled", u() || p(), true), u() ? escape(kt("checkout.placing")) : escape(kt("combo.add")), escape(kt("combo.note")));
    } });
  } }))) });
}

export { Y as default };
//# sourceMappingURL=_combo_2.mjs.map
