# GDPR & Privacy Policy (NO EXTERNAL TRAFFIC)

**<span style="color:red; font-size:1.5em; font-weight:bold;">WE CAN NEVER OUTSOURCE WEB TRAFFIC LIKE THIS!</span>**

This website is hosted on GitHub Pages with a Strato server connection. To maintain 100% GDPR compliance and completely avoid the need for cookie consent banners, **we must never load external resources (scripts, fonts, css, etc.) from third-party domains (like unpkg.com, Google Fonts, etc).**

### Rules for all AI Agents:
1. **NO EXTERNAL CDNS:** Do not add `<script src="https://...">` or `<link href="https://...">` to the HTML.
2. **LOCAL VENDORING ONLY:** If a third-party library is needed (like React), you must download the minified files locally (e.g., into `ci/vendor/`) and link them using local relative paths.
3. **ZERO COOKIES:** The site must remain completely static and independent to protect user privacy.
