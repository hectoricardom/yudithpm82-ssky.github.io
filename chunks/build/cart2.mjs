import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from 'solid-js/web';
import { Show, For } from 'solid-js';
import { j as je, k as kt, p, I, y, E } from '../../index.mjs';
import { e } from './Money-BFVoQFsZ.mjs';
import { g as g$1 } from './ProductImage-DdC0ohbV.mjs';
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

var v = ["<div", ' class="grid gap-6 lg:grid-cols-3"><div class="', '">', '</div><aside class="card sticky top-20 flex h-fit flex-col gap-3 p-5"><div class="flex justify-between text-sm"><span class="text-muted">', '</span><span class="font-medium">', '</span></div><div class="flex items-baseline justify-between border-t border-line pt-3"><span class="font-semibold">', '</span><span class="font-display text-2xl font-extrabold tracking-tight">', '</span></div><button type="button"', ' class="btn-primary py-3.5">', "</button></aside></div>"], g = ["<div", ' class="flex flex-col gap-6"><h1 class="font-display text-2xl font-extrabold tracking-tight">', "</h1><!--$-->", "<!--/--></div>"], h = ["<div", ' class="card flex flex-col items-center gap-3 py-20 text-center"><p class="font-display text-lg font-bold">', "</p><!--$-->", "<!--/--></div>"], b = ["<div", ' class="card flex items-center gap-4 p-3"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl">', '</div><div class="min-w-0 flex-1"><div class="line-clamp-2 text-sm font-medium">', '</div><div class="text-sm text-muted">', '</div></div><div class="flex items-center rounded-lg border border-line"><button type="button" class="h-8 w-8 text-lg text-muted hover:text-ink">\u2212</button><span class="w-8 text-center text-sm font-semibold">', '</span><button type="button" class="h-8 w-8 text-lg text-muted hover:text-ink">+</button></div><span class="hidden w-20 text-right font-semibold sm:block">', '</span><button type="button"', ' class="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-canvas hover:text-red-600"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"></path></svg></button></div>'];
function P() {
  return je(), ssr(g, ssrHydrationKey(), escape(kt("cart.title")), escape(createComponent(Show, { get when() {
    return I().length > 0;
  }, get fallback() {
    return ssr(h, ssrHydrationKey(), escape(kt("cart.empty")), escape(createComponent(E, { href: "/", class: "btn-primary px-5 py-2.5", get children() {
      return kt("nav.catalog");
    } })));
  }, get children() {
    return ssr(v, ssrHydrationKey(), `flex flex-col gap-3 lg:col-span-2 ${p() ? "pointer-events-none opacity-60" : ""}`, escape(createComponent(For, { get each() {
      return I();
    }, children: (s) => ssr(b, ssrHydrationKey(), escape(createComponent(g$1, { get name() {
      return s.name;
    }, get image() {
      return s.image;
    }, class: "h-full w-full", markClass: "h-7 w-7 text-xs", caption: false })), escape(s.name), escape(e(s.price)), escape(s.qty), escape(e(s.lineTotal)), ssrAttribute("aria-label", escape(kt("cart.remove"), true), false)) })), escape(kt("cart.subtotal")), escape(e(y())), escape(kt("checkout.total")), escape(e(y())), ssrAttribute("disabled", p(), true), escape(kt("cart.checkout")));
  } })));
}

export { P as default };
//# sourceMappingURL=cart2.mjs.map
