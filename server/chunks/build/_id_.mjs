import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { createSignal, createResource, Show, For } from 'solid-js';
import { q, U } from './api-CoAX2wNl.mjs';
import { i as it, k as kt } from './i18n-BOvpsPhe.mjs';
import { e } from './Money-BFVoQFsZ2.mjs';
import { h } from './RequireAuth-DAHEMjcW.mjs';

var y = ["<div", ' class="py-16 text-center text-muted">', "</div>"], m = ["<span", ">", "</span>"], w = ["<div", ' class="flex gap-2"><button type="button"', ' class="btn-primary px-4 py-2.5">', '</button><button type="button"', ' class="btn-ghost px-4 py-2.5">', "</button></div>"], _ = ["<div", ' class="card divide-y divide-line">', "</div>"], S = ["<div", ' class="mx-auto flex max-w-2xl flex-col gap-5"><!--$-->', '<!--/--><div class="flex flex-wrap items-center gap-3"><h1 class="font-display text-2xl font-extrabold tracking-tight">', '</h1><span class="', '">', '</span></div><div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted"><!--$-->', "<!--/--><!--$-->", "<!--/--><span>", "</span></div><!--$-->", "<!--/--><!--$-->", '<!--/--><div class="flex items-baseline justify-between border-t border-line pt-3"><span class="font-semibold">', '</span><span class="font-display text-xl font-extrabold tracking-tight">', "</span></div><!--$-->", "<!--/--></div>"], A = ["<div", ' class="flex items-center gap-3 p-3.5"><div class="flex-1"><div class="font-medium">', '</div><div class="text-sm text-muted"><!--$-->', "<!--/-->: <!--$-->", '<!--/--></div></div><span class="font-medium">', "</span></div>"], k = ["<div", ' class="card bg-canvas p-4 text-sm"><div class="text-neutral-700"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="text-muted"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--> \xB7 <!--$-->", "<!--/--></div></div>"];
const D = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-brand-tint text-brand", cancelled: "bg-neutral-100 text-neutral-500", expired: "bg-red-50 text-red-600" };
function O() {
  const p = it(), [d, R] = createSignal(false), [c, { refetch: q$1 }] = createResource(() => p.id, (t) => q.orders.get(t));
  return createComponent(Show, { get when() {
    return c();
  }, get fallback() {
    return ssr(y, ssrHydrationKey(), c.loading ? escape(kt("common.loading")) : escape(kt("common.error")));
  }, children: (t) => {
    var _a, _b;
    return ssr(S, ssrHydrationKey(), escape(createComponent(U, { href: "/orders", class: "inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink", get children() {
      return ["\u2190 ", kt("orders.title")];
    } })), escape(((_a = t().customer) == null ? void 0 : _a.name) || `#${t().id.slice(-8)}`), `rounded-full px-2.5 py-1 text-xs font-semibold ${escape((_b = D[t().status]) != null ? _b : "bg-neutral-100", true)}`, escape(kt(`status.${t().status}`)), escape(createComponent(Show, { get when() {
      var _a2;
      return (_a2 = t().customer) == null ? void 0 : _a2.phone;
    }, get children() {
      return ssr(m, ssrHydrationKey(), escape(t().customer.phone));
    } })), escape(createComponent(Show, { get when() {
      var _a2;
      return (_a2 = t().customer) == null ? void 0 : _a2.email;
    }, get children() {
      return ssr(m, ssrHydrationKey(), escape(t().customer.email));
    } })), escape(new Date(t().createdAt).toLocaleString()), escape(createComponent(Show, { get when() {
      return t().status === "pending";
    }, get children() {
      return ssr(w, ssrHydrationKey(), ssrAttribute("disabled", d(), true), escape(kt("orders.confirm")), ssrAttribute("disabled", d(), true), escape(kt("orders.cancel")));
    } })), escape(createComponent(Show, { get when() {
      var _a2;
      return (_a2 = t().lines) == null ? void 0 : _a2.length;
    }, get children() {
      return ssr(_, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return t().lines;
      }, children: (r) => ssr(A, ssrHydrationKey(), escape(r.name), escape(kt("cart.qty")), escape(r.qty), escape(e(r.lineTotal))) })));
    } })), escape(kt("orders.total")), escape(e(t().total)), escape(createComponent(Show, { get when() {
      return t().shippingAddress;
    }, children: (r) => ssr(k, ssrHydrationKey(), escape(r().line1), escape(createComponent(Show, { get when() {
      return r().line2;
    }, get children() {
      return [", ", r().line2];
    } })), escape(r().city), escape(createComponent(Show, { get when() {
      return r().state;
    }, get children() {
      return [", ", r().state];
    } })), escape(createComponent(Show, { get when() {
      return r().zip;
    }, get children() {
      return [" ", r().zip];
    } })), escape(r().country)) })));
  } });
}
function j() {
  return createComponent(h, { get children() {
    return createComponent(O, {});
  } });
}

export { j as default };
//# sourceMappingURL=_id_.mjs.map
