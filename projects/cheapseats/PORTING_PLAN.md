# CheapSeats: Multi-Platform Porting & Distribution Plan

> **Goal:** Bring CheapSeats to **Android (Google Play)** and **iOS (Add to Home Screen / PWA)** without paying Apple's recurring $99/year subscription, while maintaining a professional, polished public presence.

---

## 1. Distribution Strategy & Cost Matrix

| Platform | Target Distribution | User Experience | Cost | Status / Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Android** | **Google Play Store** | Native app, automatic background updates, Google Play Protect verified | **€25** (One-time, lifetime account) | **Moderate** (~1 weekend) |
| **iOS / Mobile Web** | **PWA ("Add to Home Screen")** | Full-screen app, standalone window, custom home icon, 0 warnings | **€0** (Free forever via Cloudflare/GitHub Pages) | **Low–Moderate** (~2–3 days) |
| **macOS** | **Local / Personal Build** | Native desktop app with custom overlay title bar | **€0** (Free on your own Mac) | **Ready now** (`npm run tauri dev`) |
| **macOS (Public)** | *Optional Future Upgrade* | Notarized `.dmg` / Mac App Store | *Requires $99/yr Apple Dev account (defer for now)* | On hold until budget allows |

---

## 2. Track 1: Android Port (Tauri v2 $\rightarrow$ Google Play)

### Phase 2.1: Prerequisites & Toolchain Setup
1. **Google Play Console Account:**
   - Register at [play.google.com/console](https://play.google.com/console/) and pay the one-time **$25 fee**.
2. **Android Development Tools on Mac:**
   - Install **Android Studio** (includes Android SDK, Command-line Tools, Platform-tools).
   - In Android Studio SDK Manager, install:
     - Android SDK Platform 34 (or newer)
     - Android SDK Build-Tools 34.0.0
     - NDK (Side by side) & CMake
   - Set environment variables in your shell (`~/.zshrc`):
     ```bash
     export ANDROID_HOME="$HOME/Library/Android/sdk"
     export NDK_HOME="$ANDROID_HOME/ndk/<version>"
     export PATH="$PATH:$ANDROID_HOME/platform-tools"
     ```

### Phase 2.2: Tauri Android Initialization
Run inside `bay-window/`:
```bash
npm run tauri android init
```
This generates the native Android project in `src-tauri/gen/android/`.

### Phase 2.3: Code & UX Adjustments for Android
1. **Hardware Back Button Navigation:**
   - On Android, users expect the system back gesture to dismiss open overlays before closing the app.
   - Add a listener in React/Tauri to close `SettingsModal`, `RuleBookOverlay`, `WatercoolerOverlay`, or the mobile navigation drawer when back is pressed.
2. **Notification Channels (Android 8+):**
   - In `tauri-plugin-notification`, create explicit channels (e.g., `cheapseats_scores` with importance `Default`) so game alerts display properly.
3. **App Icons & Adaptive Icons:**
   - Export adaptive icons (`foreground.png` and `background.png`) into `src-tauri/gen/android/app/src/main/res/mipmap-*`.

### Phase 2.4: Release Build & Signing
1. Generate an upload keystore:
   ```bash
   keytool -genkey -v -keystore cheapseats-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias cheapseats
   ```
2. Build the Android App Bundle (`.aab`):
   ```bash
   npm run tauri android build -- --aab
   ```
3. Upload the `.aab` to Google Play Console for internal testing $\rightarrow$ Production release.

---

## 3. Track 2: iOS & Mobile Web PWA ("Add to Home Screen")

Since Apple charges $99/yr for native App Store hosting, a **Progressive Web App (PWA)** gives iOS users an app-like experience for **€0**.

### Phase 3.1: Architecture & CORS Relay
* **The Problem:** Inside desktop Tauri, Rust fetches ESPN endpoints via `tauri-plugin-http`, bypassing browser CORS rules. In a standard web browser (iOS Safari), direct calls to `site.api.espn.com` get blocked by CORS.
* **The Solution:** A free **Cloudflare Worker** (free tier includes 100,000 requests/day).

#### Free Cloudflare Worker Code (`cors-proxy.js`):
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url).searchParams.get("url");
    if (!url) return new Response("Missing target URL", { status: 400 });

    // Restrict upstream to ESPN and YouTube APIs only
    const allowed = ["site.api.espn.com", "site.web.api.espn.com", "www.youtube.com"];
    const targetHost = new URL(url).hostname;
    if (!allowed.some(h => targetHost.endsWith(h))) {
      return new Response("Forbidden upstream host", { status: 403 });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "CheapSeats-PWA/1.0" }
    });

    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    return new Response(res.body, { status: res.status, headers });
  }
};
```

#### Frontend HTTP Adapter (`src/data/http.ts`):
```typescript
import { isDesktop } from '../lib/platform';

export async function fetchJson<T>(url: string): Promise<T> {
  if (isDesktop()) {
    // Native Tauri HTTP plugin (desktop)
    const { fetch } = await import('@tauri-apps/plugin-http');
    const res = await fetch(url);
    return res.json();
  } else {
    // PWA web fallback via CORS proxy
    const proxyUrl = `https://your-worker.workers.dev/?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    return res.json();
  }
}
```

### Phase 3.2: PWA Manifest & iOS Safari Tags
1. Add `public/manifest.webmanifest`:
   ```json
   {
     "name": "CheapSeats",
     "short_name": "CheapSeats",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0f172a",
     "theme_color": "#0f172a",
     "icons": [
       { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }
   ```
2. Add iOS meta tags into `index.html`:
   ```html
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
   <meta name="apple-mobile-web-app-title" content="CheapSeats">
   <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
   ```
3. Add `vite-plugin-pwa` to `vite.config.ts` for automatic offline caching.

---

## 4. Track 3: macOS Desktop (Personal & Future Public Path)

### Current Setup (Free / Personal):
* Run locally on your Mac:
  ```bash
  npm run tauri dev
  ```
* Generates a fully functional native macOS app with zero restrictions on your own computer.

### Future Path (When Budget Allows):
* If you eventually obtain an Apple Developer Account ($99/yr):
  1. Generate a Developer ID Application Certificate.
  2. Add your Apple ID / API Key to GitHub Secrets.
  3. Run `npm run tauri build` $\rightarrow$ Tauri automatically invokes `notarytool` to notarize the `.dmg` so anyone can double-click and install with 0 warnings.
  4. The **same $99 account** immediately unlocks the native **iOS App Store & TestFlight** build without extra fees.

---

## 5. Execution Roadmap

```
[ Step 1: PWA Web Build ] 
  ├── Create Cloudflare Worker CORS proxy (free)
  ├── Adapt `http.ts` for browser fallback
  └── Deploy web app to GitHub Pages / Cloudflare Pages
      └── Result: iOS users can "Add to Home Screen" immediately (€0)

[ Step 2: Google Play Account ]
  ├── Pay €25 one-time developer registration
  ├── Run `npm run tauri android init`
  ├── Add back-gesture handler and app icons
  └── Submit `.aab` to Google Play Store
      └── Result: Official Google Play Store listing (€25)

[ Step 3: Portfolio Integration ]
  ├── Add "Get it on Google Play" badge to `mika-jeske.de`
  └── Add "Open Web App / Add to Home Screen" button
```
