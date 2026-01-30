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
│   ├── guia-do-capoeirista-kwanza/  # Capoeira guide (songs, protocols, graduations)
│   ├── vem-aprender/          # "Come learn" section
│   ├── blog/                  # Blog posts
│   └── contatos/              # Contact page
├── layouts/                   # Custom layouts (overrides theme)
│   ├── _default/              # Default templates (baseof.html, home.html, single.html, list.html)
│   ├── partials/              # Reusable components
│   │   ├── home/              # Homepage sections (hero.html, about.html)
│   │   ├── equipe/            # Team sections (header, historia-grupo, historia-mestre, equipe, valores)
│   │   ├── head.html          # HTML head (meta, CSS, fonts)
│   │   ├── nav.html           # Navigation bar
│   │   └── footer.html        # Site footer
│   ├── shortcodes/            # Custom shortcodes
│   │   └── musica.html        # Song display component
│   ├── equipe-kwanza/         # Section-specific layout (list.html)
│   └── guia-do-capoeirista-kwanza/  # Section-specific layout (list.html)
├── static/                    # Static assets
│   ├── img/                   # Images (WebP format preferred)
│   │   └── hero/              # Hero carousel images
│   ├── css/                   # Custom CSS (modular architecture)
│   │   ├── style.css          # Main CSS file (imports all others)
│   │   ├── base/              # Foundation (font, tokens, reset, typography, layout, sections, grid)
│   │   ├── components/        # UI components (navigation, button, footer, musica)
│   │   ├── sections/          # Section styles (hero, home-about)
│   │   └── pages/             # Page-specific styles (equipe, guia)
│   ├── js/                    # Custom JavaScript (nav-toggle.js, hero-carousel.js)
│   ├── docs/                  # PDF documents
│   ├── audio/                 # Audio files (for songs)
│   └── favicon/               # Favicon files
├── themes/                    # Hugo theme (git submodule)
│   └── beautifulhugo/         # Beautiful Hugo theme (from halogenica/beautifulhugo)
├── .gitignore                 # Git ignore file (public/, .hugo_build.lock, .DS_Store)
├── .gitmodules                # Submodule configuration
├── hugo.toml                  # Hugo configuration (baseURL, menu, markup settings)
├── netlify.toml              # Netlify deployment config (build command, Hugo version)
└── AGENTS.md                 # This file
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
- **Spacing tokens** (`--space-xs` to `--space-xl`) for consistent spacing
- **Layout tokens** (`--container-max`, `--container-padding`, `--nav-height`)
- File organization:
  - `base/` - foundational styles (font, tokens, reset, typography, layout, grid)
  - `components/` - reusable UI components (navigation, button, footer, musica)
  - `sections/` - page section styles (hero, home-about)
  - `pages/` - page-specific styles (equipe, guia)

### Design Tokens
The site uses a comprehensive design system defined in `static/css/base/tokens.css`:

**Colors:**
- `--color-primary: #E85D1F` (orange)
- `--color-secondary: #9E1B32` (burgundy)
- `--color-accent: #F2B705` (gold)
- `--color-balance: #1F3D2B` (dark green)
- Dark theme with black backgrounds and white-soft text

**Spacing:**
- `--space-xs: 0.5rem` (8px)
- `--space-sm: 1rem` (16px)
- `--space-md: 1.5rem` (24px)
- `--space-lg: 2rem` (32px)
- `--space-xl: 3rem` (48px)

**Layout:**
- `--container-max: 1100px` (max width for content)
- `--container-padding: 24px` (horizontal padding)
- `--nav-height: 72px` (navigation bar height)

**Border radius:**
- `--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 22px`

**Transitions:**
- `--transition-fast: 0.2s ease`, `--transition-base: 0.35s ease`

### JavaScript
- Vanilla JavaScript (no frameworks)
- Event listeners wrapped in `DOMContentLoaded`
- Simple, focused functionality:
  - `nav-toggle.js` - mobile navigation toggle
  - `hero-carousel.js` - hero image carousel (6-second intervals)
- Use `aria-*` attributes for accessibility

### Hugo Shortcodes
- **Custom shortcode**: `musica` (defined in `layouts/shortcodes/musica.html`)
- Used for displaying capoeira songs with lyrics, audio, and YouTube videos
- Parameters:
  - `titulo` (required) - Song title
  - `autor` (optional) - Author/composer info
  - `youtube` (optional) - YouTube video ID
  - `audio` (optional) - Audio file path
- Inner content contains lyrics (processed with `markdownify`)
- Renders with expandable `<details>` for lyrics
- Example usage in `content/guia-do-capoeirista-kwanza/cantigas-essenciais.md`

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
- Common front matter fields:
  - `title` (required) - Page title
  - `description` (optional) - Meta description
  - `subtitle` (optional) - Displayed subtitle
  - `weight` (optional) - Ordering in menus/lists
- Use Hugo shortcodes for rich media (see `musica` shortcode)
- Content sections:
  - `_index.md` files define section pages
  - Individual `.md` files for sub-pages
  - Example: `guia-do-capoeirista-kwanza/cantigas-essenciais.md`

## Important Gotchas

1. **Theme Submodule**: The `themes/beautifulhugo` directory is a git submodule. Do not edit theme files directly unless you intend to fork the theme. Instead, override with custom layouts in `layouts/`.

2. **Hugo Version**: The site requires Hugo 0.124.0 or higher (checked in `layouts/_default/baseof.html` line 1). Netlify uses Hugo 0.152.2. Local development environment has Hugo 0.152.2 installed via snap.

3. **Build Output**: The `public/` directory is git-ignored. Always run `hugo` or `hugo --minify` to generate the site.

4. **Menu Configuration**: Navigation menu is defined in `hugo.toml` under `[menu.main]`. Add new sections there.

5. **CSS Imports**: The main `style.css` imports all other CSS files. Add new CSS files to the appropriate import section. No longer uses `base/sections.css` (merged into `layout.css`).

5a. **Grid System**: Use `.grid-2col` for two-column layouts (replaces old `.equipe-grid`). Responsive by default (stacks on mobile at 900px breakpoint).

6. **Image Optimization**: Use WebP format with appropriate `loading="lazy"` and `decoding="async"` attributes for performance.

7. **Accessibility**: Follow existing patterns with ARIA labels (`aria-label`, `aria-expanded`) and semantic HTML.

8. **Markup Configuration**: Hugo's markup processor uses Goldmark with `unsafe = true` in `hugo.toml` (line 54-55), allowing raw HTML in Markdown content.

9. **Layout Hierarchy**: Hugo uses template lookup order. Custom layouts in `layouts/` override theme templates. The base template is `layouts/_default/baseof.html`, which includes partials and defines the main block.

## Workflow for Common Tasks

### Adding a New Page
1. Create Markdown file in appropriate `content/` subdirectory
2. Add front matter with `title`, optional `subtitle` and `weight`
3. Create custom layout in `layouts/` if needed (override theme)
4. Add menu entry in `hugo.toml` if page should appear in navigation

### Adding a New CSS Component
1. Create CSS file in appropriate directory (`components/`, `sections/`, or `pages/`)
2. Import the file in `static/css/style.css` in the correct section
3. **Always use design tokens** from `tokens.css` instead of hardcoded values:
   - Spacing: use `--space-*` tokens
   - Colors: use semantic color tokens (`--text-main`, `--accent-default`, etc.)
   - Layout: use `--container-max`, `--container-padding`
   - Transitions: use `--transition-fast` or `--transition-base`
4. Follow BEM-like naming convention (`.component`, `.component--modifier`)
5. Keep selectors simple and avoid deep nesting

### Adding JavaScript Functionality
1. Create JS file in `static/js/`
2. Wrap code in `DOMContentLoaded` event listener
3. Add appropriate ARIA attributes for accessibility
4. Keep functionality simple and focused

### Updating the Theme
1. Pull latest theme changes: `git submodule update --remote themes/beautifulhugo`
2. Test locally: `hugo server`
3. Commit the submodule update

### Adding a New Shortcode
1. Create HTML file in `layouts/shortcodes/` (e.g., `component-name.html`)
2. Use `.Get` to access parameters: `{{ .Get "param-name" }}`
3. Use `.Inner` for wrapped content: `{{ .Inner | markdownify }}`
4. Use in content files: `{{< shortcode-name param="value" >}}content{{< /shortcode-name >}}`
5. Reference existing `musica.html` shortcode as example

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
- Song lyrics and cultural content use authentic capoeira language

## File Naming Conventions

- Markdown files: lowercase with hyphens (e.g., `cantigas-essenciais.md`)
- CSS files: lowercase with hyphens (e.g., `home-about.css`)
- JavaScript files: lowercase with hyphens (e.g., `nav-toggle.js`)
- Images: lowercase with hyphens, WebP format preferred (e.g., `logo-kwanza.webp`)
- Section directories: lowercase with hyphens (e.g., `guia-do-capoeirista-kwanza/`)

## Important File References

- **Main config**: `hugo.toml` (menu at line 14-50, markup at line 52-55)
- **Deploy config**: `netlify.toml` (Hugo version at line 5-6)
- **Base template**: `layouts/_default/baseof.html` (Hugo version check at line 1-3)
- **Main CSS**: `static/css/style.css` (all imports)
- **Color tokens**: `static/css/base/tokens.css` (design system)
- **Git ignores**: `.gitignore` (public/, .hugo_build.lock, .DS_Store)
- **Theme submodule**: `.gitmodules` (Beautiful Hugo from halogenica/beautifulhugo)

## CSS Refactoring Notes (January 2025)

The CSS was refactored for simplicity and maintainability:
- **Removed**: `base/sections.css` (merged into `layout.css`)
- **Renamed**: `.equipe-grid` → `.grid-2col` (more semantic, reusable)
- **Enhanced tokens**: Added spacing (`--space-*`) and layout (`--container-*`) tokens
- **Simplified**: Removed duplicate styles, consolidated transitions
- **Improved**: All spacing now uses tokens for consistency
- **Grid system**: Unified two-column grid with built-in responsiveness

---

*Last updated: January 30, 2025*