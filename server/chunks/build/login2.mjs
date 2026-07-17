import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { j as je, l as lt, m as mt, G as Ge, k as k$1, a as kt, h as ht } from '../../index.mjs';
import { createSignal, onMount, Show } from 'solid-js';
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

var k = ["<p", ' class="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">', "</p>"], w = ["<button", ' type="button" class="btn-primary w-full py-3">', "</button>"], $ = ["<div", ' class="mx-auto max-w-sm py-16"><!--$-->', '<!--/--><div class="card flex flex-col items-center gap-5 p-8 text-center"><span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand font-display text-xl font-extrabold text-white">M</span><div><h1 class="font-display text-xl font-extrabold tracking-tight">', '</h1><p class="mt-1 text-sm text-muted">', "</p></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], T = ["<p", ' class="text-muted">', "</p>"];
function j() {
  const i = je(), [s] = lt(), [d, l] = createSignal(false);
  onMount(async () => {
    if (mt()) {
      i(c(), { replace: true });
      return;
    }
    const e = typeof s.token == "string" ? s.token : void 0;
    if (e) {
      l(true);
      const m = await Ge(e);
      l(false), m && i(c(), { replace: true });
    }
  });
  function c() {
    const e = s.redirect;
    return typeof e == "string" && e.startsWith("/") ? e : "/";
  }
  return ssr($, ssrHydrationKey(), escape(createComponent(k$1, { get children() {
    return [kt("login.title"), " \u2014 Marquet"];
  } })), escape(kt("login.title")), escape(kt("login.merchant")), escape(createComponent(Show, { get when() {
    return ht();
  }, get children() {
    return ssr(k, ssrHydrationKey(), escape(ht()));
  } })), escape(createComponent(Show, { get when() {
    return !d();
  }, get fallback() {
    return ssr(T, ssrHydrationKey(), escape(kt("common.loading")));
  }, get children() {
    return ssr(w, ssrHydrationKey(), escape(kt("login.continue")));
  } })));
}

export { j as default };
//# sourceMappingURL=login2.mjs.map
