# samylla.com

Static portfolio site — plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure
```
index.html          Home — bilingual statement + flower illustration
about.html          About — bio, experience accordion, "Off work" cat gallery
works.html          Works — coming-soon state
css/style.css       All styles (design tokens, components, pages)
js/main.js          Interactions: mobile menu, PT/EN switch, accordion, scroll-reveal fallback
assets/fonts/       Satoshi Variable (self-hosted)
assets/images/cats/ Off work photos
```

## Publish on GitHub Pages
1. Create a repository (e.g. `samylla-site`) and upload all files in this folder to its root.
2. Repository → **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main`, folder `/ (root)`.
3. For the custom domain, enter `samylla.com` under **Custom domain** (this creates a `CNAME` file), then point your DNS:
   - `A` records for `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` for `www` → `<your-github-username>.github.io`
4. Tick **Enforce HTTPS** once the certificate is issued.

## Fonts
- Satoshi by Indian Type Foundry, via Fontshare (free under the ITF Free Font License).
- Instrument Serif via Google Fonts (SIL Open Font License).
