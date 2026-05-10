Performance notes and commands

1) Convert hero image to WebP and create responsive variants

Install tools (macOS):

```bash
brew install webp
```

Then run (example):

```bash
chmod +x image-convert.sh
./image-convert.sh path/to/hero-original.jpg
```

This creates `images/hero-original-1600.webp`, `-1200.webp`, `-800.webp` and JPG fallbacks.

2) Update `index.html` picture sources

The repository already contains a `<picture>` element in `index.html` that references `images/hero-800.webp`, `images/hero-1200.webp`, `images/hero-1600.webp` and fallbacks. After running the conversion script, those files will be present for browsers to choose the best one.

3) Run Lighthouse locally (recommended)

Install Lighthouse CLI:

```bash
npm install -g lighthouse
```

Run a Lighthouse audit (mobile emulation):

```bash
lighthouse http://localhost:8080 --preset=mobile --output html --output-path=./lighthouse-report.html
```

You can serve the site locally with a static server, for example:

```bash
npm install -g http-server
http-server -c-1 . -p 8080
```

4) Netlify headers

A `_headers` file is included with recommended cache-control rules. If you deploy elsewhere, configure equivalent cache headers (long max-age for hashed assets, short for HTML).

5) Service Worker

A basic `service-worker.js` has been added and is registered from `script.js`. It performs conservative caching for navigation, images and scripts. Test in a staging environment before relying on it in production.

6) Other suggestions

- Use hashed filenames for production assets (e.g., `style.abc123.css`) and set long cache headers.
- Lazy-load non-critical third-party scripts (analytics, chat) after `load` or `requestIdleCallback`.
- Run `lighthouse` and share the LCP/network dependency tree if you'd like me to further target the largest blockers.
