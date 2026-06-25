import { createComponent, ssr, ssrHydrationKey, ssrAttribute, escape } from 'solid-js/web';
import { Show } from 'solid-js';
import { k as kt } from '../../index.mjs';

var i = ["<img", ' class="', '" loading="lazy">'], o = ["<span", ' class="text-[11px] font-medium uppercase tracking-wide text-neutral-400">', "</span>"], u = ["<div", ' class="', '"><span class="', '">M</span><!--$-->', "<!--/--></div>"];
function g(e) {
  return createComponent(Show, { get when() {
    return e.image;
  }, get fallback() {
    var _a, _b;
    return ssr(u, ssrHydrationKey(), `flex flex-col items-center justify-center gap-2 bg-canvas ${escape((_a = e.class) != null ? _a : "", true)}`, `flex items-center justify-center rounded-xl bg-brand-tint font-display font-extrabold text-brand ${escape((_b = e.markClass) != null ? _b : "h-12 w-12 text-xl", true)}`, escape(createComponent(Show, { get when() {
      return e.caption !== false;
    }, get children() {
      return ssr(o, ssrHydrationKey(), escape(kt("product.noPhoto")));
    } })));
  }, get children() {
    var _a;
    return ssr(i, ssrHydrationKey() + ssrAttribute("src", escape(e.image, true), false) + ssrAttribute("alt", escape(e.name, true), false), `object-cover ${escape((_a = e.class) != null ? _a : "", true)}`);
  } });
}

export { g };
//# sourceMappingURL=ProductImage-DdC0ohbV.mjs.map
