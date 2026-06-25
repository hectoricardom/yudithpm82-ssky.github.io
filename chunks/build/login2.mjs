import { ssr, ssrHydrationKey, escape, createComponent } from 'solid-js/web';
import { createSignal, onMount, Show } from 'solid-js';
import { j as je, l as lt, m as mt, G as Ge, k as kt, h as ht } from '../../index.mjs';
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

var b = ["<p", ' class="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">', "</p>"], k = ["<button", ' type="button" class="btn-primary w-full py-3">', "</button>"], w = ["<div", ' class="mx-auto max-w-sm py-16"><div class="card flex flex-col items-center gap-5 p-8 text-center"><span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand font-display text-xl font-extrabold text-white">M</span><div><h1 class="font-display text-xl font-extrabold tracking-tight">', '</h1><p class="mt-1 text-sm text-muted">', "</p></div><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], $ = ["<p", ' class="text-muted">', "</p>"];
function M() {
  const o = je(), [s] = lt(), [d, i] = createSignal(false);
  onMount(async () => {
    if (mt()) {
      o(l(), { replace: true });
      return;
    }
    const e = typeof s.token == "string" ? s.token : void 0;
    if (e) {
      i(true);
      const m = await Ge(e);
      i(false), m && o(l(), { replace: true });
    }
  });
  function l() {
    const e = s.redirect;
    return typeof e == "string" && e.startsWith("/") ? e : "/";
  }
  return ssr(w, ssrHydrationKey(), escape(kt("login.title")), escape(kt("login.merchant")), escape(createComponent(Show, { get when() {
    return ht();
  }, get children() {
    return ssr(b, ssrHydrationKey(), escape(ht()));
  } })), escape(createComponent(Show, { get when() {
    return !d();
  }, get fallback() {
    return ssr($, ssrHydrationKey(), escape(kt("common.loading")));
  }, get children() {
    return ssr(k, ssrHydrationKey(), escape(kt("login.continue")));
  } })));
}

export { M as default };
//# sourceMappingURL=login2.mjs.map
