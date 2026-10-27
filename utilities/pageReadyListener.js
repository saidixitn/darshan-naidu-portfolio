let pageReady = !1;
const handler = {
  set: function (e, t, a) {
    return (
      "pageReady" === t &&
        document.dispatchEvent(new CustomEvent("onPageReady", { detail: a })),
      (e[t] = a),
      !0
    );
  },
};
export let proxy = new Proxy({}, handler);
Object.defineProperty(proxy, "pageReady", {
  get: () => pageReady,
  set: (e) => ((pageReady = e), !0),
});
