# dotlottie-wc — vendored

`@lottiefiles/dotlottie-wc@0.9.14`, used only by `projects/cheapseats/index.html` for
the animation above the footer.

Vendored because CLAUDE.md forbids external traffic: the page previously pulled six
requests from `unpkg.com`, `cdn.jsdelivr.net` and `lottie.host` on every visit, which
sent visitor IPs to three third parties on a site that carries no consent banner.

## Contents

| file | source |
|---|---|
| `dotlottie-wc.js` | `unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/` (entry) |
| `base-dotlottie-wc.js` | same |
| `decorate-C0oFmnNg.js` | same |
| `dist-BMnS_qxa.js` | same (the player) |
| `dotlottie-player.wasm` | `cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.72.1/dist/` |

The animation itself is `ci/assets/video/cheapseats.lottie`, from
`lottie.host/0caf9409-4c20-463f-adb2-1888ab19648b/AYjitS8tKr.lottie`.

The four `.js` files import each other by relative path, so they must stay in one
directory. Their `//# sourceMappingURL=` comments were stripped — the `.map` files are
not vendored and would 404 whenever someone opened devtools.

## Local patch — re-apply on any upgrade

`dist-BMnS_qxa.js` fetched the WASM from a hardcoded CDN template, so vendoring the
file alone would still have hit the network. Both the primary and the backup URL were
replaced with a module-relative one:

```js
// was: `https://cdn.jsdelivr.net/npm/${d}@${u}/dist/dotlottie-player.wasm`
//      `https://unpkg.com/${d}@${u}/dist/dotlottie-player.wasm`
new URL("./dotlottie-player.wasm", import.meta.url).href
```

`import.meta.url` rather than a path relative to the document: `fetch()` resolves
against the page, not the module, so a relative string would break if the component is
ever used from a page at another depth.

The library also exposes `DotLottie.setWasmUrl()`, which would avoid patching — but
reaching it means importing the minified alias (`export{ae as n}`), and that name
changes on every upstream build. The patch is the stabler of the two.

After upgrading, re-run the replacement and confirm nothing external survives:

```sh
grep -rE 'https?://(cdn\.jsdelivr\.net|unpkg\.com|lottie\.host)' ci/vendor/dotlottie/
```

## Weight

`dotlottie-player.wasm` is ~1.7 MB. It is fetched only after the component upgrades,
and only on the cheapseats page — but it is by far the heaviest asset on the site. If
that animation is ever not worth 1.7 MB, deleting the `<dotlottie-wc>` block and this
directory is the whole removal.
