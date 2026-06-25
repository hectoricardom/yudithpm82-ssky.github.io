import { ssr, ssrHydrationKey, ssrStyleProperty, escape, createComponent } from 'solid-js/web';
import { createResource, For, Show } from 'solid-js';
import { j as je, a as I, k as kt } from '../../index.mjs';
import { a } from './combos-Dyt9v_Yz.mjs';
import { B, q } from './PromoBanner-BxZ7nt9B.mjs';
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
import './Money-BFVoQFsZ.mjs';
import './ProductImage-DdC0ohbV.mjs';

var g = ["<div", ' class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">', "</div>"], y = ["<div", ' class="flex flex-col gap-6"><section class="card relative overflow-hidden"><div class="aspect-[16/9] bg-cover bg-right bg-no-repeat sm:aspect-[16/5]" style="', '"></div><div class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:via-white/70"></div><div class="absolute inset-0 flex max-w-lg flex-col justify-center px-5 sm:px-10"><h1 class="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">', '</h1><p class="mt-1 text-sm text-neutral-600">', '</p></div></section><div class="grid gap-3 sm:grid-cols-2">', '</div><div class="flex items-center justify-between"><h2 class="font-display text-lg font-bold tracking-tight">', '</h2><a href="/" class="text-sm font-medium text-brand hover:underline"><!--$-->', "<!--/--> \u2192</a></div><!--$-->", "<!--/--></div>"], w = ["<div", ' class="card overflow-hidden"><div class="skeleton aspect-square"></div><div class="flex flex-col gap-2 p-3"><div class="skeleton h-3.5 w-full rounded"></div><div class="skeleton h-3.5 w-2/3 rounded"></div></div></div>'], k = ["<div", ' class="card flex flex-col items-center gap-3 py-16 text-center"><p class="font-display text-lg font-bold">', '</p><a href="/" class="btn-primary px-5 py-2.5">', "</a></div>"];
function M() {
  const f = je(), [n] = createResource(async () => (await Promise.all([0, 48, 96, 144].map((a) => I.shop.products({ limit: 48, offset: a }).catch(() => null)))).flatMap((a) => {
    var _a;
    return (_a = a == null ? void 0 : a.items) != null ? _a : [];
  }).filter((a) => a.inStock)), c = () => {
    var _a;
    return (_a = n()) != null ? _a : [];
  };
  return ssr(y, ssrHydrationKey(), ssrStyleProperty("background-image:", "url(/img/promo.jpg)"), escape(kt("offers.title")), escape(kt("offers.subtitle")), escape(createComponent(For, { each: a, children: (r) => createComponent(B, { get variant() {
    return r.variant;
  }, get image() {
    return r.image;
  }, get eyebrow() {
    return `${kt("offers.combo")} \xB7 \u2212${r.discountPct}%`;
  }, get title() {
    return kt(r.titleKey);
  }, get subtitle() {
    return kt(r.descKey);
  }, get cta() {
    return kt("offers.see");
  }, onClick: () => f(`/ofertas/${r.id}`) }) })), escape(kt("offers.available")), escape(kt("offers.seeAll")), escape(createComponent(Show, { get when() {
    return !n.loading;
  }, get fallback() {
    return ssr(g, ssrHydrationKey(), escape(createComponent(For, { get each() {
      return Array.from({ length: 8 });
    }, children: () => ssr(w, ssrHydrationKey()) })));
  }, get children() {
    return createComponent(Show, { get when() {
      return c().length > 0;
    }, get fallback() {
      return ssr(k, ssrHydrationKey(), escape(kt("offers.empty")), escape(kt("nav.catalog")));
    }, get children() {
      return ssr(g, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return c();
      }, children: (r) => createComponent(q, { product: r }) })));
    } });
  } })));
}

export { M as default };
//# sourceMappingURL=index22.mjs.map
