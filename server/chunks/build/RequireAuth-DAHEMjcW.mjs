import { createComponent, ssr, ssrHydrationKey, escape } from 'solid-js/web';
import { createEffect, Show } from 'solid-js';
import { j as je, p as pt, m as mt, k as kt } from './i18n-BOvpsPhe.mjs';

var d = ["<div", ' class="py-20 text-center text-neutral-500">', "</div>"];
function h(t) {
  const r = je();
  return createEffect(() => {
    !pt() && !mt() && r("/login", { replace: true });
  }), createComponent(Show, { get when() {
    return mt();
  }, get fallback() {
    return ssr(d, ssrHydrationKey(), escape(kt("common.loading")));
  }, get children() {
    return t.children;
  } });
}

export { h };
//# sourceMappingURL=RequireAuth-DAHEMjcW.mjs.map
