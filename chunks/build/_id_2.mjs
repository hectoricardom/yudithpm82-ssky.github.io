import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { k } from './index-BSDoL9aR.mjs';
import { createResource, createSignal, Show, For } from 'solid-js';
import { I, E } from './api-DqM-qoWO.mjs';
import { p } from './cart-BVEqF9aF.mjs';
import { i as it, k as kt } from './i18n-BOvpsPhe.mjs';
import { e } from './Money-BFVoQFsZ2.mjs';
import { g } from './ProductImage-BAkaKQC1.mjs';

var S = ["<div", ' class="py-24 text-center text-muted">', "</div>"], _ = ["<div", ' class="flex gap-2">', "</div>"], P = ["<span", ' class="w-fit rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">', "</span>"], q = ["<span", ' class="text-sm text-muted">', "</span>"], A = ["<span", ' class="text-sm text-muted">/ <!--$-->', "<!--/--></span>"], C = ["<p", ' class="whitespace-pre-line text-sm leading-relaxed text-neutral-600">', "</p>"], T = ["<div", ' class="flex flex-col gap-5"><!--$-->', '<!--/--><div class="grid gap-8 md:grid-cols-2"><div class="flex flex-col gap-3"><div class="card aspect-square overflow-hidden">', "</div><!--$-->", '<!--/--></div><div class="flex flex-col gap-4"><!--$-->', '<!--/--><h1 class="font-display text-2xl font-extrabold leading-tight tracking-tight">', "</h1><!--$-->", '<!--/--><div class="flex items-baseline gap-2"><span class="font-display text-3xl font-extrabold tracking-tight">', "</span><!--$-->", '<!--/--></div><span class="', '"><span class="', '"></span><!--$-->', "<!--/--></span><!--$-->", '<!--/--><button type="button"', ' class="btn-primary mt-2 py-3.5">', "</button></div></div></div>"], D = ["<button", ' type="button" class="', '"><img', ' class="h-full w-full object-cover"></button>'];
function U() {
  const g$1 = it(), [l] = createResource(() => g$1.id, (t) => I.shop.product(t)), [c, M] = createSignal(0), d = (t, i) => t && t.length ? t : i ? [i] : [];
  return [createComponent(k, { get children() {
    var _a;
    return ((_a = l()) == null ? void 0 : _a.name) ? `${l().name} \u2014 Marquet` : "Producto \u2014 Marquet";
  } }), createComponent(Show, { get when() {
    return l();
  }, get fallback() {
    return ssr(S, ssrHydrationKey(), l.loading ? escape(kt("common.loading")) : escape(kt("common.error")));
  }, children: (t) => ssr(T, ssrHydrationKey(), escape(createComponent(E, { href: "/", class: "inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink", get children() {
    return ["\u2190 ", kt("product.back")];
  } })), escape(createComponent(g, { get name() {
    return t().name;
  }, get image() {
    return d(t().images, t().image)[c()];
  }, get category() {
    return t().category;
  }, class: "h-full w-full", markClass: "h-20 w-20 text-3xl" })), escape(createComponent(Show, { get when() {
    return d(t().images, t().image).length > 1;
  }, get children() {
    return ssr(_, ssrHydrationKey(), escape(createComponent(For, { get each() {
      return d(t().images, t().image);
    }, children: (i, u) => ssr(D, ssrHydrationKey(), `h-16 w-16 overflow-hidden rounded-xl border transition-colors ${c() === u() ? "border-brand" : ""} ${c() !== u() ? "border-line" : ""}`, ssrAttribute("src", escape(i, true), false)) })));
  } })), escape(createComponent(Show, { get when() {
    return t().category;
  }, get children() {
    return ssr(P, ssrHydrationKey(), escape(t().category));
  } })), escape(t().name), escape(createComponent(Show, { get when() {
    return t().brand;
  }, get children() {
    return ssr(q, ssrHydrationKey(), escape(t().brand));
  } })), escape(e(t().price)), escape(createComponent(Show, { get when() {
    return t().unit;
  }, get children() {
    return ssr(A, ssrHydrationKey(), escape(t().unit));
  } })), `flex w-fit items-center gap-1.5 text-sm font-medium ${t().inStock ? "text-brand" : ""} ${t().inStock ? "" : "text-neutral-400"}`, `h-2 w-2 rounded-full ${t().inStock ? "bg-brand" : ""} ${t().inStock ? "" : "bg-neutral-300"}`, t().inStock ? escape(kt("product.inStock")) : escape(kt("product.outOfStock")), escape(createComponent(Show, { get when() {
    return t().description;
  }, get children() {
    return ssr(C, ssrHydrationKey(), escape(t().description));
  } })), ssrAttribute("disabled", !t().inStock || p(), true), t().inStock ? escape(kt("product.addToCart")) : escape(kt("product.outOfStock"))) })];
}

export { U as default };
//# sourceMappingURL=_id_2.mjs.map
