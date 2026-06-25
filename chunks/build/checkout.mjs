import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { createSignal, createMemo, Show, For } from 'solid-js';
import { k as kt } from './i18n-BOvpsPhe.mjs';
import { y, I } from './cart-Dae0Y9sg.mjs';
import { e } from './Money-BFVoQFsZ2.mjs';
import { E } from './api-Cva_LdRg.mjs';

var J = ["<p", ' class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">', "</p>"], O = ["<form", ' class="grid gap-6 lg:grid-cols-3"><div class="flex flex-col gap-5 lg:col-span-2"><h1 class="font-display text-2xl font-extrabold tracking-tight">', '</h1><section class="card flex flex-col gap-4 p-5"><h2 class="text-sm font-semibold text-muted">', '</h2><div class="grid gap-4 sm:grid-cols-3"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div></section><section class="card flex flex-col gap-4 p-5"><h2 class="text-sm font-semibold text-muted">', '</h2><div class="grid grid-cols-2 gap-2 rounded-xl bg-canvas p-1">', '</div><div class="grid gap-4 sm:grid-cols-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div></section></div><aside class="card sticky top-20 flex h-fit flex-col gap-3 p-5"><h2 class="text-sm font-semibold text-muted">', '</h2><div class="flex justify-between text-sm"><span class="text-muted">', '</span><span class="font-medium">', '</span></div><div class="flex items-baseline justify-between border-t border-line pt-3"><span class="font-semibold">', '</span><span class="font-display text-2xl font-extrabold tracking-tight">', '</span></div><p class="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-xs text-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><!--$-->', "<!--/--></p><!--$-->", '<!--/--><button type="submit"', ' class="btn-primary py-3.5">', "</button></aside></form>"], Q = ["<div", ' class="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center"><div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint text-3xl text-brand">\u2713</div><p class="font-display text-xl font-bold">', '</p><p class="text-sm text-muted">#<!--$-->', "<!--/--></p><!--$-->", "<!--/--></div>"], T = ["<div", ' class="py-20 text-center text-muted">', "</div>"], W = ["<button", ' type="button" class="', '">', "</button>"], X = ["<label", ' class="', '"><span class="text-xs font-medium text-muted">', '</span><input class="input"', "", "></label>"];
function ie() {
  const [l, Y] = createSignal("USA"), [p, ee] = createSignal(false), [g, te] = createSignal(null), [o, re] = createSignal(null), [x, b] = createSignal(""), [f, v] = createSignal(""), [k, y$1] = createSignal(""), [$, w] = createSignal(""), [I$1, q] = createSignal(""), [S, A] = createSignal(""), [C, U] = createSignal(""), [_, P] = createSignal(""), [B, j] = createSignal(""), [D, L] = createSignal(""), [M, z] = createSignal(""), [E$1, F] = createSignal(""), [N, R] = createSignal(""), m = createMemo(() => y());
  return createComponent(Show, { get when() {
    return !o();
  }, get fallback() {
    return ssr(Q, ssrHydrationKey(), o().paid ? escape(kt("checkout.paySuccess")) : escape(kt("checkout.pending")), escape(o().res.orderId.slice(-8)), escape(createComponent(E, { href: "/", class: "btn-ghost px-5 py-2.5", get children() {
      return kt("nav.catalog");
    } })));
  }, get children() {
    return createComponent(Show, { get when() {
      return I().length > 0;
    }, get fallback() {
      return ssr(T, ssrHydrationKey(), escape(kt("cart.empty")));
    }, get children() {
      return ssr(O, ssrHydrationKey(), escape(kt("checkout.title")), escape(kt("checkout.customer")), escape(createComponent(s, { get label() {
        return kt("checkout.name");
      }, get value() {
        return x();
      }, onInput: b, required: true })), escape(createComponent(s, { get label() {
        return kt("checkout.email");
      }, get value() {
        return f();
      }, onInput: v })), escape(createComponent(s, { get label() {
        return kt("checkout.phone");
      }, get value() {
        return k();
      }, onInput: y$1, required: true })), escape(kt("checkout.destination")), escape(createComponent(For, { each: ["USA", "CUBA"], children: (i) => ssr(W, ssrHydrationKey(), `rounded-lg py-2.5 text-sm font-semibold transition-colors ${l() === i ? "bg-white text-ink shadow-sm" : ""} ${l() !== i ? "text-muted hover:text-ink" : ""}`, i === "USA" ? escape(kt("checkout.usa")) : escape(kt("checkout.cuba"))) })), escape(createComponent(Show, { get when() {
        return l() === "CUBA";
      }, get children() {
        return [createComponent(s, { get label() {
          return kt("checkout.recipient");
        }, get value() {
          return B();
        }, onInput: j, required: true }), createComponent(s, { get label() {
          return kt("checkout.recipientPhone");
        }, get value() {
          return D();
        }, onInput: L, required: true })];
      } })), escape(createComponent(s, { get label() {
        return kt("checkout.address");
      }, get value() {
        return $();
      }, onInput: w, required: true, class: "sm:col-span-2" })), escape(createComponent(Show, { get when() {
        return l() === "CUBA";
      }, get fallback() {
        return [createComponent(s, { get label() {
          return kt("checkout.line2");
        }, get value() {
          return I$1();
        }, onInput: q, class: "sm:col-span-2" }), createComponent(s, { get label() {
          return kt("checkout.city");
        }, get value() {
          return S();
        }, onInput: A, required: true }), createComponent(s, { get label() {
          return kt("checkout.state");
        }, get value() {
          return C();
        }, onInput: U, required: true }), createComponent(s, { get label() {
          return kt("checkout.zip");
        }, get value() {
          return _();
        }, onInput: P, required: true })];
      }, get children() {
        return [createComponent(s, { get label() {
          return kt("checkout.province");
        }, get value() {
          return M();
        }, onInput: z, required: true }), createComponent(s, { get label() {
          return kt("checkout.municipality");
        }, get value() {
          return E$1();
        }, onInput: F, required: true }), createComponent(s, { get label() {
          return kt("checkout.ci");
        }, get value() {
          return N();
        }, onInput: R, class: "sm:col-span-2" })];
      } })), escape(kt("checkout.title")), escape(kt("cart.subtotal")), escape(e(m())), escape(kt("checkout.total")), escape(e(m())), escape(kt("checkout.stripeNote")), escape(createComponent(Show, { get when() {
        return g();
      }, get children() {
        return ssr(J, ssrHydrationKey(), escape(g()));
      } })), ssrAttribute("disabled", p(), true), p() ? escape(kt("checkout.placing")) : escape(kt("checkout.pay")));
    } });
  } });
}
function s(l) {
  var _a;
  return ssr(X, ssrHydrationKey(), `flex flex-col gap-1.5 ${escape((_a = l.class) != null ? _a : "", true)}`, escape(l.label), ssrAttribute("value", escape(l.value, true), false), ssrAttribute("required", l.required, true));
}

export { ie as default };
//# sourceMappingURL=checkout.mjs.map
