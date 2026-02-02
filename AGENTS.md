# AGENTS.md - Grupo Kwanza Hugo Site

This document provides essential information for AI agents working in the Grupo Kwanza Hugo static site repository.

## Project Overview

This is a **Hugo static site** for Grupo Kwanza, a capoeira group. The site uses the **Beautiful Hugo** theme (submodule) with extensive custom layouts, CSS, and JavaScript. The site is in **Portuguese (pt-br)** and focuses on capoeira education, team information, cultural content, and events.

## Essential Commands

### Development
```bash
# Start local development server (with live reload)
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
- Hugo version: **0.152.2** (enforced in Netlify config)

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
│   ├── equipe-kwanza/         # Team/identity section
│   ├── guia-do-capoeirista-kwanza/  # Capoeira guide
│   │   ├── sistema-de-graduacoes.md  # Graduation system with images
│   │   ├── protocolo-da-roda.md      # Roda protocol
│   │   ├── cantigas.md               # Songs (with search)
│   │   └── _index.md                 # Guide landing with menu
│   ├── calendario-kwanza/     # Events calendar
│   ├── contatos/              # Contact page with locations
│   ├── vem-aprender/          # "Come learn" section
│   └── blog/                  # Blog posts
├── layouts/                   # Custom layouts (overrides theme)
│   ├── _default/              # Default templates
│   │   ├── baseof.html        # Base template (with translate="no")
│   │   ├── home.html          # Homepage layout
│   │   ├── single.html        # Single page template
│   │   └── list.html          # List page template
│   ├── partials/              # Reusable components
│   │   ├── home/              # Homepage sections
│   │   │   ├── hero.html      # Hero carousel (3 images, 6s interval)
│   │   │   └── about.html     # About sections
│   │   ├── calendario/        # Calendar sections
│   │   │   └── hero.html      # Calendar hero (no CTA)
│   │   ├── equipe/            # Team page sections
│   │   ├── head.html          # HTML head (with notranslate meta)
│   │   ├── nav.html           # Navigation bar
│   │   └── footer.html        # Site footer (includes scripts)
│   ├── shortcodes/            # Custom shortcodes
│   │   └── musica.html        # Song display component
│   ├── equipe-kwanza/         # Team section layout
│   ├── guia-do-capoeirista-kwanza/  # Guide layouts
│   │   ├── list.html          # Guide menu page
│   │   └── single.html        # Guide subpages
│   ├── calendario-kwanza/     # Calendar layout
│   └── contatos/              # Contact page layout
├── static/                    # Static assets
│   ├── img/                   # Images (WebP format preferred)
│   │   ├── hero/              # Hero carousel images (3 images)
│   │   ├── eventos/           # Event thumbnail images
│   │   └── graduacoes/        # Graduation system images
│   ├── css/                   # Custom CSS (modular architecture)
│   │   ├── style.css          # Main CSS file (imports all others)
│   │   ├── base/              # Foundation (6 files)
│   │   │   ├── font.css       # Font imports (Google Fonts)
│   │   │   ├── tokens.css     # Design tokens (colors, spacing, etc.)
│   │   │   ├── reset.css      # CSS reset
│   │   │   ├── typography.css # Typography styles
│   │   │   ├── layout.css     # Layout containers
│   │   │   └── grid.css       # Grid system (.grid-2col)
│   │   ├── components/        # UI components (7 files)
│   │   │   ├── navigation.css
│   │   │   ├── button.css
│   │   │   ├── footer.css
│   │   │   ├── musica.css     # Song display component
│   │   │   ├── busca.css      # Search input
│   │   │   ├── guia-menu.css  # Guide menu cards
│   │   │   └── graduacoes.css # Graduation images grid
│   │   ├── sections/          # Section styles (3 files)
│   │   │   ├── hero.css       # Hero section (100vh, responsive)
│   │   │   ├── eventos.css    # Events carousel
│   │   │   └── home-about.css # Home about sections
│   │   └── pages/             # Page-specific styles (4 files)
│   │       ├── equipe.css
│   │       ├── guia.css
│   │       ├── calendario.css
│   │       └── contatos.css
│   ├── js/                    # Custom JavaScript (4 files)
│   │   ├── nav-toggle.js      # Mobile navigation toggle
│   │   ├── hero-carousel.js   # Hero image carousel (6s auto)
│   │   ├── eventos-carousel.js # Events carousel (5s auto + manual)
│   │   └── busca-musica.js    # Song search functionality
│   ├── docs/                  # PDF documents
│   ├── audio/                 # Audio files (for songs)
│   └── favicon/               # Favicon files
├── themes/beautifulhugo/      # Hugo theme (git submodule)
├── .gitignore                 # Git ignore (public/, .hugo_build.lock)
├── .gitmodules                # Submodule config
├── hugo.toml                  # Hugo configuration
├── netlify.toml              # Netlify deployment config
└── AGENTS.md                 # This file
```

## Code Patterns and Conventions

### Hugo Templates

**Layout Hierarchy:**
- All pages use `baseof.html` as base template
- Override `{{ define "main" }}` block for page content
- Use `{{ define "header" }}{{ end }}` to suppress default header

**Common Template Patterns:**
```go
// Access parent page (for inheritance)
{{ with .Parent }}
  {{ .Params.subtitle }}
{{ end }}

// Conditional rendering based on filename
{{ if eq .File.BaseFileName "cantigas" }}
  // Cantigas-specific code
{{ end }}

// Range over front matter data
{{ range .Params.graduacoes }}
  // Render each item
{{ end }}
```

### Standard Layout Classes

**Header Pattern (consistent across all pages):**
```html
<header class="page-header">
  <div class="container">
    <div class="editorial-content">
      <h1>{{ .Title }}</h1>
      <p class="lead">{{ $subtitle }}</p>
    </div>
  </div>
</header>
```

**Content Pattern:**
```html
<section class="pagina-conteudo section">
  <div class="container">
    <div class="editorial-content">
      {{ .Content }}
    </div>
  </div>
</section>
```

**Key Layout Classes:**
- `.page-header` - Page header container
- `.editorial-content` - Max-width 720px content wrapper (used everywhere)
- `.container` - Max-width 1100px with padding
- `.section` - Standard section spacing
- `.grid-2col` - Two-column responsive grid

### CSS Architecture

**Modular CSS with design tokens:**
- Main entry point: `static/css/style.css`
- All other CSS files imported via `@import`
- **Never use hardcoded values** - always use tokens

**Import Order (critical):**
```css
/* BASE - Foundation */
@import "base/font.css";
@import "base/tokens.css";      /* Design system */
@import "base/reset.css";
@import "base/typography.css";
@import "base/layout.css";
@import "base/grid.css";

/* COMPONENTS - Reusable UI */
@import "components/navigation.css";
@import "components/button.css";
@import "components/footer.css";
@import "components/musica.css";
@import "components/busca.css";
@import "components/guia-menu.css";
@import "components/graduacoes.css";

/* SECTIONS - Page sections */
@import "sections/hero.css";
@import "sections/eventos.css";
@import "sections/home-about.css";

/* PAGES - Page-specific */
@import "pages/equipe.css";
@import "pages/guia.css";
@import "pages/calendario.css";
@import "pages/contatos.css";
```

### Design Tokens (tokens.css)

**Colors:**
```css
--color-primary: #E85D1F;     /* Orange */
--color-secondary: #9E1B32;   /* Burgundy */
--color-accent: #F2B705;      /* Gold */
--color-balance: #1F3D2B;     /* Dark green */

/* Semantic tokens */
--bg-main: var(--black-pure);
--bg-section: var(--black-soft);
--text-main: var(--white-soft);
--heading-primary: var(--color-accent);
--heading-secondary: var(--color-primary);
--accent-default: var(--color-primary);
--accent-hover: var(--color-secondary);
```

**Spacing (always use these):**
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
```

**Layout:**
```css
--container-max: 1100px;      /* Max width for containers */
--container-padding: 24px;    /* Horizontal padding */
--nav-height: 72px;           /* Navigation bar height */
```

**Border Radius:**
```css
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 22px;
```

**Transitions:**
```css
--transition-fast: 0.2s ease;
--transition-base: 0.35s ease;
```

### JavaScript Patterns

**All scripts use vanilla JavaScript with DOMContentLoaded:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Your code here
});
```

**Carousel Pattern (hero-carousel.js, eventos-carousel.js):**
- Auto-play with configurable interval
- Pause on hover/focus
- Pause when tab is hidden
- Resume on mouse leave/tab active
- Manual controls (arrows, dots)

**Search Pattern (busca-musica.js):**
- Real-time filtering as user types
- Case-insensitive search
- Search in multiple fields (title, lyrics)
- Show/hide results dynamically

### Hugo Shortcodes

**Musica Shortcode** (`layouts/shortcodes/musica.html`):
```markdown
{{< musica
  titulo="Nome da Canção"
  autor="Mestre · Toque: Estilo"
  youtube="VIDEO_ID"
>}}
Letra da música aqui...
{{< /musica >}}
```

**Parameters:**
- `titulo` (required) - Song title
- `autor` (optional) - Author/master and toque info
- `youtube` (optional) - YouTube video ID
- `audio` (optional) - Audio file path
- Inner content: Song lyrics (Markdown)

**Rendering:**
- Title and author in header
- Video (YouTube) or audio player on right side (360px fixed)
- Lyrics on left side in collapsible `<details>` (default: closed)
- Sticky video during scroll

### Content Patterns

**Front Matter Standards:**
```yaml
---
title: "Page Title"                    # Required
description: "Short description"       # Optional (used as subtitle)
subtitle: "Alternative subtitle"       # Optional (for _index.md)
weight: 1                             # Optional (ordering)

# Page-specific data structures
graduacoes:                           # For graduations page
  - titulo: "Name"
    imagem: "/img/path.webp"

eventos_lista: |                      # For calendar page (markdown)
  ### Month YYYY
  **DD/MM - Event Name**
  Details here...
---
```

**Subtitle Inheritance Pattern:**
- Single pages check own `description` first
- If not found, inherit parent's `subtitle`
- Implemented in `guia-do-capoeirista-kwanza/single.html`

### Images and Assets

**WebP Format (preferred everywhere):**
- Hero images: 1920x1080px (landscape)
- Event thumbnails: 400x300px
- Graduation images: 800x1200px (portrait)

**Image Attributes:**
```html
<img 
  src="/img/path.webp" 
  alt="Descriptive text"
  loading="lazy"          <!-- Except first hero image -->
  decoding="async"
>
```

**Image Organization:**
- `/static/img/hero/` - Hero carousel (roda_1.webp, roda_2.webp, treino_1.webp)
- `/static/img/eventos/` - Event thumbnails
- `/static/img/graduacoes/` - Graduation charts
- `/static/favicon/` - Favicon files

## Important Gotchas

### 1. Theme Submodule
The `themes/beautifulhugo` directory is a git submodule. **Never edit theme files directly**. Always override with custom layouts in `layouts/`.

### 2. Hugo Version Requirements
- Minimum: Hugo 0.124.0 (checked in `baseof.html`)
- Netlify: Hugo 0.152.2 (defined in `netlify.toml`)
- Local: Hugo 0.152.2 via snap

### 3. Translation Prevention
**Critical**: To prevent Google Translate from auto-translating Portuguese content:
- `<html translate="no">` in `baseof.html`
- `<meta name="google" content="notranslate">` in `head.html`

### 4. Build Output
The `public/` directory is git-ignored. Always run `hugo --minify` before deployment (handled automatically by Netlify).

### 5. Menu Configuration
Navigation menu defined in `hugo.toml` under `[menu.main]`. Current order:
1. Home
2. Identidade Kwanza
3. Guia do Capoeirista Kwanza
4. Vem Aprender
5. Calendário
6. Blog
7. Contatos

### 6. CSS Imports
**Critical**: Add new CSS files to `style.css` in the correct section order (base → components → sections → pages). The order matters for cascade.

### 7. Grid System
Use `.grid-2col` for two-column layouts (replaces old `.equipe-grid`). Automatically responsive:
- Desktop (>900px): 2 columns
- Mobile (≤900px): 1 column (stacked)

### 8. Editorial Content Wrapper
**Always wrap text content** in `.editorial-content` for consistent max-width (720px) and alignment. Used in:
- All page headers
- All content sections
- Guia menu
- Calendário content
- Contatos content

### 9. Hero Height
Hero sections use **fixed height** (not min-height):
- Desktop: `100vh`
- Tablet (<900px): `85vh`
- Mobile (<768px): `75vh`
- Small mobile (<480px): `70vh`

This ensures images scale properly with viewport.

### 10. Shortcode Details Element
The `musica` shortcode uses `<details>` **without** `open` attribute by default. Lyrics are collapsed on page load.

## Site Structure and Pages

### Homepage
- **Hero**: Carousel (3 images, 6s auto-rotation)
- **About sections**: Three `.grid-2col` sections with info + CTA
- No events carousel (moved to Calendário page)

### Identidade Kwanza (Team)
- Page header with editorial content
- História do Grupo
- História do Mestre (with image in `.grid-2col`)
- Valores (philosophy)
- **No** team member grid (moved to Contatos)

### Guia do Capoeirista Kwanza
**Landing page** (`list.html`):
- Header with title and subtitle
- Intro text
- Three visual menu cards:
  1. Sistema de Graduações
  2. Protocolo da Roda
  3. Cantigas

**Subpages** (`single.html`):
- **Sistema de Graduações**: Two graduation images side-by-side (`.graduacoes-grid`)
- **Protocolo da Roda**: Text content
- **Cantigas**: Search box + song list with `musica` shortcodes

### Calendário Kwanza
- **Hero**: Same carousel as home (no CTA button)
- **Agenda Completa**: Markdown list of events by month
- Uses `eventos_lista` front matter parameter

### Contatos (Contacts)
- Page header with editorial content
- Intro text
- **Locais Kwanza**: Team member locations grouped by country/state
  - Brazil (São Paulo, Pernambuco, Minas Gerais)
  - Chile
  - México
- Each location: name, address, phone, Google Maps link

## Workflow for Common Tasks

### Adding a New Page

1. **Create content file:**
   ```bash
   # For section page
   mkdir -p content/new-section
   touch content/new-section/_index.md
   
   # For single page
   touch content/section/page-name.md
   ```

2. **Add front matter:**
   ```yaml
   ---
   title: "Page Title"
   description: "Subtitle or description"
   weight: 1
   ---
   ```

3. **Create layout (if needed):**
   ```bash
   mkdir -p layouts/new-section
   touch layouts/new-section/list.html
   ```

4. **Add to menu** (in `hugo.toml`):
   ```toml
   [[menu.main]]
     identifier = "identifier"
     name = "Display Name"
     url = "/section-name/"
     weight = 5
   ```

5. **Use standard header pattern:**
   ```html
   <header class="page-header">
     <div class="container">
       <div class="editorial-content">
         <h1>{{ .Title }}</h1>
         <p class="lead">{{ .Params.description }}</p>
       </div>
     </div>
   </header>
   ```

### Adding CSS Styles

1. **Create CSS file:**
   ```bash
   # Component
   touch static/css/components/new-component.css
   
   # Page
   touch static/css/pages/new-page.css
   ```

2. **Use tokens (required):**
   ```css
   .my-component {
     padding: var(--space-lg);           /* Not: 2rem */
     color: var(--text-main);            /* Not: #F7F4EF */
     background: var(--bg-section);      /* Not: #1A1A1A */
     transition: var(--transition-base); /* Not: 0.35s ease */
   }
   ```

3. **Import in style.css:**
   ```css
   /* Add in appropriate section */
   @import "components/new-component.css";
   ```

4. **Follow BEM-like naming:**
   ```css
   .component { }
   .component__element { }
   .component--modifier { }
   ```

### Adding JavaScript Functionality

1. **Create JS file:**
   ```bash
   touch static/js/new-feature.js
   ```

2. **Use DOMContentLoaded wrapper:**
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
     const element = document.querySelector('.my-element');
     if (!element) return; // Guard clause
     
     // Your code here
   });
   ```

3. **Add to footer** (if needed globally):
   ```html
   <!-- In layouts/partials/footer.html -->
   <script src="/js/new-feature.js"></script>
   ```

4. **Or load conditionally** (in specific layout):
   ```html
   {{ if eq .File.BaseFileName "specific-page" }}
     <script src="/js/new-feature.js"></script>
   {{ end }}
   ```

### Creating a Carousel

1. **Use eventos-carousel.js as template** (most complete example)

2. **Key features to include:**
   - Auto-play with pause on hover
   - Pause when tab hidden
   - Manual navigation (prev/next buttons)
   - Dot indicators
   - Responsive (adjust cards per page)
   - Keyboard accessible

3. **HTML structure:**
   ```html
   <div class="carousel">
     <div class="carousel-track">
       <!-- Items -->
     </div>
   </div>
   <div class="carousel-nav">
     <button class="prev">←</button>
     <button class="next">→</button>
   </div>
   <div class="carousel-dots"></div>
   ```

### Adding a Search Feature

1. **Use busca-musica.js as template**

2. **Pattern:**
   - Input element with `id`
   - Search on `input` event (real-time)
   - Filter by showing/hiding elements
   - Show "no results" message when needed

3. **HTML:**
   ```html
   <input 
     type="search" 
     id="search-input" 
     placeholder="Buscar..."
     aria-label="Buscar"
   >
   ```

4. **CSS:**
   ```html
   <!-- Import in single.html -->
   {{ if eq .File.BaseFileName "page-with-search" }}
     <script src="/js/search-feature.js"></script>
   {{ end }}
   ```

## Testing and Quality

### Manual Testing Checklist
- [ ] Test on desktop (1920x1080, 1366x768)
- [ ] Test on tablet (iPad, 768px)
- [ ] Test on mobile (375px, 414px)
- [ ] Check all carousels auto-play
- [ ] Check hover states
- [ ] Test search functionality
- [ ] Verify all links work
- [ ] Check responsive menu
- [ ] Test with browser translate disabled
- [ ] Verify WebP images load
- [ ] Check hero height adjusts properly

### Accessibility
- Use semantic HTML (`<header>`, `<nav>`, `<article>`, `<section>`)
- Add `aria-label` to interactive elements
- Include `alt` text on all images
- Use `<details>`/`<summary>` for collapsible content
- Keyboard navigation support (Tab, Enter, Space)
- Focus states on interactive elements

## Deployment

### Netlify Configuration
- **Build command**: `hugo --minify`
- **Publish directory**: `public/`
- **Hugo version**: 0.152.2 (set in `netlify.toml`)
- **Auto-deploy**: Pushes to `main` branch
- **Preview deploys**: Pull requests

### Pre-deployment Checklist
- [ ] Run `hugo --minify` locally
- [ ] Check for Hugo errors/warnings
- [ ] Verify all images exist
- [ ] Test locally with `hugo server`
- [ ] Check CSS imports order
- [ ] Verify JavaScript console for errors

## Language and Cultural Context

### Content Language
- **Brazilian Portuguese (pt-br)**
- Capoeira terminology (authentic usage)
- African-Brazilian cultural references
- Formal but welcoming tone

### Target Audience
- Capoeira students (all levels)
- Cultural enthusiasts
- Community members
- Potential new students

### Content Types
- Educational (Guia do Capoeirista)
- Informational (Identidade Kwanza)
- Practical (Calendário, Contatos)
- Cultural (Cantigas, História)

## File Naming Conventions

**Strict lowercase with hyphens:**
- Markdown: `sistema-de-graduacoes.md`
- CSS: `guia-menu.css`
- JavaScript: `busca-musica.js`
- Images: `kwz_grad_infantil.webp`
- Directories: `guia-do-capoeirista-kwanza/`

**Never use:**
- Spaces
- Underscores (except in image legacy)
- CamelCase
- Special characters

## Key File References

### Configuration
- `hugo.toml` - Main config (menu: lines 14-56, markup: lines 52-55)
- `netlify.toml` - Deploy config (Hugo version: line 6)
- `.gitignore` - Git exclusions
- `.gitmodules` - Theme submodule config

### Templates
- `layouts/_default/baseof.html` - Base template (translate="no", Hugo version check)
- `layouts/partials/head.html` - HTML head (notranslate meta)
- `layouts/partials/footer.html` - Footer (script includes)

### CSS
- `static/css/style.css` - Main CSS (all imports)
- `static/css/base/tokens.css` - Design system
- `static/css/base/layout.css` - Layout containers

### JavaScript
- `static/js/hero-carousel.js` - Hero image rotation (6s)
- `static/js/eventos-carousel.js` - Events carousel (5s, auto + manual)
- `static/js/busca-musica.js` - Song search
- `static/js/nav-toggle.js` - Mobile menu

## Recent Changes (January 2025)

### CSS Refactoring
- Removed `base/sections.css` (merged into `layout.css`)
- Renamed `.equipe-grid` → `.grid-2col`
- Added spacing tokens (`--space-*`)
- Added layout tokens (`--container-*`, `--nav-height`)
- Removed duplicate styles
- Consolidated all transitions to use tokens

### New Pages
- **Calendário Kwanza**: Hero + events list (moved from home)
- **Contatos refactored**: Team locations moved here from Equipe

### Layout Standardization
- All pages now use `.page-header` + `.editorial-content` pattern
- Consistent 720px max-width for text content
- Subtitle inheritance (child pages inherit parent subtitle if not defined)

### New Components
- `guia-menu.css` - Visual menu cards for Guide section
- `graduacoes.css` - Two-column graduation images grid
- `calendario.css` - Calendar page styles
- `busca.css` - Search input styles

### Guia do Capoeirista Kwanza Restructure
- Landing page now shows menu with 3 cards (not full list)
- Only visible pages: Sistema de Graduações, Protocolo da Roda, Cantigas
- Cantigas renamed from "Cantigas Essenciais"
- Added search functionality to Cantigas page
- Graduation page displays two images side-by-side

### Translation Prevention
- Added `translate="no"` to `<html>` tag
- Added `<meta name="google" content="notranslate">`
- Prevents Google Translate auto-detection

### Hero Improvements
- Fixed responsive height (uses `height` not `min-height`)
- Proper image scaling at all viewport sizes
- Consistent across Home and Calendário pages

---

*Last updated: January 31, 2025*
