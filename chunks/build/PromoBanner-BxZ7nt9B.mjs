import { ssr, ssrHydrationKey, escape, createComponent, ssrStyleProperty, ssrAttribute } from 'solid-js/web';
import { Show, createSignal } from 'solid-js';
import { E, k as kt } from '../../index.mjs';
import { e } from './Money-BFVoQFsZ.mjs';
import { g } from './ProductImage-DdC0ohbV.mjs';

var b = ["<span", ' class="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-neutral-500 shadow-sm ring-1 ring-black/5">', "</span>"], f = ["<span", ' class="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">', "</span>"], h = ["<div", ' class="card group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(15,23,41,0.16)]"><!--$-->', '<!--/--><div class="flex flex-1 flex-col gap-1 p-3"><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="mt-auto flex items-center justify-between gap-2 pt-2"><span class="font-display text-lg font-bold tracking-tight">', '</span><button type="button"', ' class="btn-primary h-9 w-9 shrink-0 rounded-full p-0 text-lg">', "</button></div></div></div>"];
function q(r) {
  const t = r.product, [s, k] = createSignal(false);
  return ssr(h, ssrHydrationKey(), escape(createComponent(E, { get href() {
    return `/product/${t.id}`;
  }, class: "relative block aspect-square", get children() {
    return [createComponent(g, { get name() {
      return t.name;
    }, get image() {
      return t.image;
    }, get category() {
      return t.category;
    }, class: "h-full w-full transition-transform duration-300 group-hover:scale-[1.02]" }), createComponent(Show, { get when() {
      return !t.inStock;
    }, get children() {
      return ssr(b, ssrHydrationKey(), escape(kt("product.outOfStock")));
    } })];
  } })), escape(createComponent(Show, { get when() {
    return t.category;
  }, get children() {
    return ssr(f, ssrHydrationKey(), escape(t.category));
  } })), escape(createComponent(E, { get href() {
    return `/product/${t.id}`;
  }, class: "line-clamp-2 text-sm font-medium leading-snug text-ink hover:text-brand", get title() {
    return t.name;
  }, get children() {
    return t.name;
  } })), escape(e(t.price)), ssrAttribute("disabled", !t.inStock || s(), true) + ssrAttribute("aria-label", escape(kt("product.addToCart"), true), false), s() ? "\u2026" : "+");
}
var x = ["<div", ' class="absolute inset-0 bg-cover bg-right bg-no-repeat" style="', '"></div>'], v = ["<div", ' class="', '"></div>'], w = ["<p", ' class="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">', "</p>"], $ = ["<p", ' class="mt-1 text-sm text-white/80">', "</p>"], y = ["<button", ' type="button" class="', '"><!--$-->', '<!--/--><div class="relative z-10 min-w-0 flex-1"><!--$-->', '<!--/--><h3 class="mt-0.5 font-display text-lg font-extrabold leading-tight sm:text-xl">', "</h3><!--$-->", '<!--/--></div><span class="relative z-10 flex shrink-0 items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/25"><!--$-->', '<!--/--><span class="transition-transform group-hover:translate-x-0.5">\u2192</span></span></button>'];
function B(r) {
  const t = r.variant === "dark";
  return ssr(y, ssrHydrationKey(), `card group relative flex min-h-[120px] w-full items-center gap-4 overflow-hidden p-5 text-left text-white transition-shadow hover:shadow-[0_10px_30px_-15px_rgba(15,23,41,0.25)] ${t ? "" : "bg-brand border-transparent"} ${t ? "bg-ink border-transparent" : ""}`, escape(createComponent(Show, { get when() {
    return r.image;
  }, get children() {
    return [ssr(x, ssrHydrationKey(), ssrStyleProperty("background-image:", `url(${escape(r.image, true)})`)), ssr(v, ssrHydrationKey(), `absolute inset-0 ${t ? "" : "bg-gradient-to-r from-brand via-brand/95 to-brand/30"} ${t ? "bg-gradient-to-r from-ink via-ink/95 to-ink/30" : ""}`)];
  } })), escape(createComponent(Show, { get when() {
    return r.eyebrow;
  }, get children() {
    return ssr(w, ssrHydrationKey(), escape(r.eyebrow));
  } })), escape(r.title), escape(createComponent(Show, { get when() {
    return r.subtitle;
  }, get children() {
    return ssr($, ssrHydrationKey(), escape(r.subtitle));
  } })), escape(r.cta));
}

export { B, q };
//# sourceMappingURL=PromoBanner-BxZ7nt9B.mjs.map
