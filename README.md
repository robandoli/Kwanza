# Grupo Kwanza Website

Static multilingual Hugo site for Grupo Kwanza (`pt`, `en`, `es`), deployed on Netlify.

## Stack
- Hugo `0.152.2`
- Theme: `themes/beautifulhugo` (submodule)
- Custom templates in `layouts/`
- Custom assets in `static/`

## Local Development
```bash
hugo server
```

## Production Build
```bash
hugo --minify
```

## Tests
Unit tests use Node built-in test runner.

```bash
npm test
```

Current coverage:
- `static/js/busca-musica.js`
- `static/js/nav-toggle.js`

## Deployment (Netlify)
- Config: `netlify.toml`
- Build command: `hugo --minify`
- Publish directory: `public/`

## Security Baseline
- `hugo.toml` with `unsafe = false` for Goldmark renderer.
- Netlify headers in `static/_headers`.
- External links with `target="_blank"` use `rel="noopener noreferrer"`.
- YouTube embeds in `layouts/shortcodes/musica.html` use `referrerpolicy` and `sandbox`.

## Performance Notes
- PDFs in `static/docs/` were compressed.
- Main `.webp` images (hero/vem-aprender/gallery) were re-optimized.
- Keep file names stable when optimizing assets to avoid broken links.

## Important Paths
- Content: `content/`
- Templates: `layouts/`
- Styles: `static/css/`
- Scripts: `static/js/`
- i18n: `i18n/`
- Theme submodule: `themes/beautifulhugo/`

