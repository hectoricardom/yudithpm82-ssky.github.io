import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { k as k$1 } from './index-BSDoL9aR.mjs';
import { createSignal, createResource, Show, For } from 'solid-js';
import { I, E as E$1 } from './api-DqM-qoWO.mjs';
import { k as kt } from './i18n-BOvpsPhe.mjs';
import { e } from './Money-BFVoQFsZ2.mjs';
import { h } from './RequireAuth-DAHEMjcW.mjs';

var _ = ["<div", ' class="grid grid-cols-2 gap-3 sm:grid-cols-4"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], k = ["<div", ' class="flex flex-col gap-3">', "</div>"], R = ["<div", ' class="flex flex-col gap-6"><!--$-->', '<!--/--><div class="flex flex-col gap-3 sm:flex-row sm:items-center"><h1 class="font-display text-2xl font-extrabold tracking-tight">', '</h1><input type="search"', ' class="input sm:ml-auto sm:w-72"></div><!--$-->', '<!--/--><div class="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">', "</div><!--$-->", "<!--/--></div>"], A = ["<button", ' type="button" class="', '">', "</button>"], T = ["<div", ' class="py-16 text-center text-muted">', "</div>"], C = ["<div", ' class="card py-16 text-center text-muted">', "</div>"], O = ["<div", ' class="font-medium">', "</div>"], D = ["<div", ' class="text-sm text-muted"><!--$-->', "<!--/--> \xB7 <!--$-->", "<!--/--> <!--$-->", "<!--/--></div>"], L = ["<div", ' class="flex gap-2"><button type="button"', ' class="btn-primary px-3 py-1.5">', '</button><button type="button"', ' class="btn-ghost px-3 py-1.5">', "</button></div>"], q = ["<div", ' class="card flex flex-wrap items-center gap-4 p-4"><!--$-->', '<!--/--><span class="', '">', '</span><span class="font-display w-24 text-right text-lg font-bold">', "</span><!--$-->", "<!--/--></div>"], F = ["<div", ' class="card p-4"><div class="text-xs font-medium text-muted">', '</div><div class="', '">', "</div></div>"];
const U = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-brand-tint text-brand", cancelled: "bg-neutral-100 text-neutral-500", expired: "bg-red-50 text-red-600" }, B = [null, "pending", "confirmed", "cancelled", "expired"];
function E() {
  const [l, H] = createSignal(null), [v, I$1] = createSignal(""), [m, K] = createSignal(null), [i, { refetch: M }] = createResource(() => I.orders.stats()), [p, { refetch: P }] = createResource(() => ({ status: l(), search: v().trim() }), ({ status: e, search: $ }) => I.orders.list({ status: e != null ? e : void 0, search: $ || void 0, limit: 100 })), g = () => {
    var _a, _b;
    return (_b = (_a = p()) == null ? void 0 : _a.orders) != null ? _b : [];
  };
  return ssr(R, ssrHydrationKey(), escape(createComponent(k$1, { get children() {
    return [kt("orders.title"), " \u2014 Marquet"];
  } })), escape(kt("orders.title")), ssrAttribute("placeholder", escape(kt("orders.search"), true), false), escape(createComponent(Show, { get when() {
    return i();
  }, get children() {
    return ssr(_, ssrHydrationKey(), escape(createComponent(c, { get label() {
      return kt("orders.pending");
    }, get value() {
      return String(i().byStatus.pending);
    } })), escape(createComponent(c, { get label() {
      return kt("orders.confirmed");
    }, get value() {
      return String(i().byStatus.confirmed);
    } })), escape(createComponent(c, { get label() {
      return kt("orders.totalCount");
    }, get value() {
      return String(i().total);
    } })), escape(createComponent(c, { get label() {
      return kt("orders.revenue");
    }, get value() {
      return e(i().confirmedRevenue);
    }, accent: true })));
  } })), escape(createComponent(For, { each: B, children: (e) => ssr(A, ssrHydrationKey(), `pill ${l() === e ? "bg-ink text-white border-ink" : ""} ${l() !== e ? "border-line bg-white text-muted hover:text-ink" : ""}`, e ? escape(kt(`status.${e}`)) : escape(kt("catalog.all"))) })), escape(createComponent(Show, { get when() {
    return !p.loading;
  }, get fallback() {
    return ssr(T, ssrHydrationKey(), escape(kt("common.loading")));
  }, get children() {
    return createComponent(Show, { get when() {
      return g().length > 0;
    }, get fallback() {
      return ssr(C, ssrHydrationKey(), escape(kt("orders.empty")));
    }, get children() {
      return ssr(k, ssrHydrationKey(), escape(createComponent(For, { get each() {
        return g();
      }, children: (e$1) => {
        var _a;
        return ssr(q, ssrHydrationKey(), escape(createComponent(E$1, { get href() {
          return `/orders/${e$1.id}`;
        }, class: "min-w-0 flex-1", get children() {
          var _a2;
          return [ssr(O, ssrHydrationKey(), escape(((_a2 = e$1.customer) == null ? void 0 : _a2.name) || `#${e$1.id.slice(-8)}`)), ssr(D, ssrHydrationKey(), escape(new Date(e$1.createdAt).toLocaleDateString()), escape(e$1.itemCount), escape(kt("orders.items")))];
        } })), `rounded-full px-2.5 py-1 text-xs font-semibold ${escape((_a = U[e$1.status]) != null ? _a : "bg-neutral-100", true)}`, escape(kt(`status.${e$1.status}`)), escape(e(e$1.total)), escape(createComponent(Show, { get when() {
          return e$1.status === "pending";
        }, get children() {
          return ssr(L, ssrHydrationKey(), ssrAttribute("disabled", m() === e$1.id, true), escape(kt("orders.confirm")), ssrAttribute("disabled", m() === e$1.id, true), escape(kt("orders.cancel")));
        } })));
      } })));
    } });
  } })));
}
function c(l) {
  return ssr(F, ssrHydrationKey(), escape(l.label), `font-display text-xl font-extrabold tracking-tight ${l.accent ? "text-brand" : ""}`, escape(l.value));
}
function W() {
  return createComponent(h, { get children() {
    return createComponent(E, {});
  } });
}

export { W as default };
//# sourceMappingURL=index3.mjs.map
