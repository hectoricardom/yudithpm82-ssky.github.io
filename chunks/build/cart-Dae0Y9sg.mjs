import { createSignal } from 'solid-js';
import { I as I$1, f } from './api-Cva_LdRg.mjs';

const n = "cartId", [a, o] = createSignal(null), [p, C] = createSignal(false);
function i() {
  return typeof localStorage > "u" ? null : localStorage.getItem(n);
}
function l() {
  typeof localStorage < "u" && localStorage.removeItem(n);
}
const u = (t) => t instanceof f && t.status === 404;
async function m() {
  const t = i();
  if (t) try {
    o(await I$1.shop.getCart(t));
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
//# sourceMappingURL=cart-Dae0Y9sg.mjs.map
