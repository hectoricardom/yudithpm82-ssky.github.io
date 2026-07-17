import { createSignal } from 'solid-js';
import { q, m as m$1 } from './api-CoAX2wNl.mjs';

const n = "cartId", [a, o] = createSignal(null), [p, C] = createSignal(false);
function i() {
  return typeof localStorage > "u" ? null : localStorage.getItem(n);
}
function l() {
  typeof localStorage < "u" && localStorage.removeItem(n);
}
const u = (t) => t instanceof m$1 && t.status === 404;
async function m() {
  const t = i();
  if (t) try {
    o(await q.shop.getCart(t));
  } catch (e) {
    u(e) && (l(), o(null));
  }
}
const g = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.itemCount) != null ? _b : 0;
}, y = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.subtotal) != null ? _b : 0;
}, I = () => {
  var _a, _b;
  return (_b = (_a = a()) == null ? void 0 : _a.lines) != null ? _b : [];
};

export { I, g, m, p, y };
//# sourceMappingURL=cart-Bgs-B906.mjs.map
