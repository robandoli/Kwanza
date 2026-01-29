# AGENTS.md - Grupo Kwanza Hugo Site

This document provides essential information for AI agents working in the Grupo Kwanza Hugo static site repository.

## Project Overview

This is a **Hugo static site** for Grupo Kwanza, a capoeira group. The site uses the **Beautiful Hugo** theme (submodule) with custom layouts, CSS, and JavaScript. The site is in **Portuguese (pt-br)** and focuses on capoeira education, team information, and cultural content.

## Essential Commands

### Development
```bash
# Start local development server
hugo server

# Build site for production (minified)
hugo --minify

# Build site (standard)
hugo
```

### Deployment
- The site is deployed to **Netlify** (see `netlify.toml`)
- Build command: `hugo --minify`
- Publish directory: `public/`

### Git Operations
```bash
# Update theme submodule
git submodule update --init --recursive

# Pull latest theme changes
git submodule update --remote themes/beautifulhugo
```

## Project Structure

```
├── content/                    # Site content (Markdown)
│   ├── _index.md              # Homepage content
│   ├── equipe-kwanza/         # Team section
│   ├── guia-do-capoeirista-kwanza/  # Capoeira guide
│   ├── vem-aprender/          # "Come learn" section
│   ├── blog/                  # Blog posts
│   └── contatos/              # Contact page
├── layouts/                   # Custom layouts (overrides theme)
│   ├── _default/              # Default templates
│   ├── partials/              # Reusable components
│   │   ├── home/              # Homepage sections
│   │   ├── equipe/            # Team page sections
│   │   └── footer.html, head.html, nav.html
│   └── equipe-kwanza/         # Section-specific layouts
├── static/                    # Static assets
│   ├── img/                   # Images (WebP format preferred)
│   ├── css/                   # Custom CSS (modular architecture)
│   ├── js/                    # Custom JavaScript
│   ├── docs/                  # PDF documents
│   └── favicon/               # Favicon files
├── themes/                    # Hugo theme (submodule)
│   └── beautifulhugo/         # Beautiful Hugo theme
├── hugo.toml                  # Hugo configuration
└── netlify.toml              # Netlify deployment config
```

## Code Patterns and Conventions

### Hugo Templates
- Use **Go template syntax** with Hugo functions
- Custom layouts override theme defaults
- Partial files are organized by section (home/, equipe/)
- Menu configuration is in `hugo.toml` under `[menu]`

### CSS Architecture
- **Modular CSS** with imports in `static/css/style.css`
- **CSS Custom Properties (CSS Variables)** defined in `tokens.css`
- File organization:
  - `base/` - foundational styles (reset, tokens, typography, layout)
  - `components/` - reusable UI components (navigation, buttons, footer)
  - `sections/` - page section styles (hero, home-about)
  - `pages/` - page-specific styles (equipe.css)

### Color Tokens
The site uses a consistent color palette defined in `static/css/base/tokens.css`:
- `--color-primary: #E85D1F` (orange)
- `--color-secondary: #9E1B32` (burgundy)
- `--color-accent: #F2B705` (gold)
- `--color-balance: #1F3D2B` (dark green)
- Dark theme with black backgrounds and white-soft text

### JavaScript
- Vanilla JavaScript (no frameworks)
- Event listeners wrapped in `DOMContentLoaded`
- Simple, focused functionality:
  - `nav-toggle.js` - mobile navigation toggle
  - `hero-carousel.js` - hero image carousel (6-second intervals)
- Use `aria-*` attributes for accessibility

### Images and Assets
- **WebP format** preferred for images
- Images stored in `static/img/` with subdirectories:
  - `hero/` - hero carousel images
  - `favicon/` - favicon variations
- Logo: `logo-kwanza.svg` and `logo-kwanza.webp`
- PDF documents in `static/docs/`

### Content (Markdown)
- Front matter in YAML format with `---` delimiters
- Portuguese language content
- Simple structure with `title`, `subtitle`, `weight` for ordering
- Content is currently minimal ("Texto em construção" placeholder)

## Important Gotchas

1. **Theme Submodule**: The `themes/beautifulhugo` directory is a git submodule. Do not edit theme files directly unless you intend to fork the theme. Instead, override with custom layouts in `layouts/`.

2. **Hugo Version**: The site requires Hugo 0.124.0 or higher (checked in `baseof.html`). Netlify uses Hugo 0.152.2.

3. **Build Output**: The `public/` directory is git-ignored. Always run `hugo` or `hugo --minify` to generate the site.

4. **Menu Configuration**: Navigation menu is defined in `hugo.toml` under `[menu.main]`. Add new sections there.

5. **CSS Imports**: The main `style.css` imports all other CSS files. Add new CSS files to the appropriate import section.

6. **Image Optimization**: Use WebP format with appropriate `loading="lazy"` and `decoding="async"` attributes for performance.

7. **Accessibility**: Follow existing patterns with ARIA labels (`aria-label`, `aria-expanded`) and semantic HTML.

## Workflow for Common Tasks

### Adding a New Page
1. Create Markdown file in appropriate `content/` subdirectory
2. Add front matter with `title`, optional `subtitle` and `weight`
3. Create custom layout in `layouts/` if needed (override theme)
4. Add menu entry in `hugo.toml` if page should appear in navigation

### Adding a New CSS Component
1. Create CSS file in appropriate directory (`components/`, `sections/`, or `pages/`)
2. Import the file in `static/css/style.css` in the correct section
3. Use existing CSS custom properties from `tokens.css`
4. Follow BEM-like naming convention (`.component`, `.component--modifier`)

### Adding JavaScript Functionality
1. Create JS file in `static/js/`
2. Wrap code in `DOMContentLoaded` event listener
3. Add appropriate ARIA attributes for accessibility
4. Keep functionality simple and focused

### Updating the Theme
1. Pull latest theme changes: `git submodule update --remote themes/beautifulhugo`
2. Test locally: `hugo server`
3. Commit the submodule update

## Testing and Quality

- No formal test suite exists
- Manually test in browser after changes
- Check responsive design (mobile/desktop)
- Verify accessibility (screen reader compatibility)
- Validate HTML structure

## Deployment

- Automatic deployment via Netlify on push to `main` branch
- Build command: `hugo --minify`
- Environment variable: `HUGO_VERSION = "0.152.2"`
- Preview deployments for pull requests

## Language and Content Notes

- All content is in **Brazilian Portuguese (pt-br)**
- Cultural context: Capoeira terminology, African-Brazilian heritage
- Target audience: Capoeira students, cultural enthusiasts, community members
- Tone: Educational, respectful, community-focused

---

*Last updated: January 2025*