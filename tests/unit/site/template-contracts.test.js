"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "../../..");

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function listFiles(dir, extension) {
  const entries = fs.readdirSync(path.join(rootDir, dir), { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath, extension);
    return entry.name.endsWith(extension) ? [entryPath] : [];
  });
}

test("templates mantem scripts e eventos globais essenciais", () => {
  const head = readProjectFile("layouts/partials/head.html");
  const base = readProjectFile("layouts/_default/baseof.html");
  const home = readProjectFile("layouts/index.html");
  const footer = readProjectFile("layouts/partials/footer.html");
  const eventShowcase = readProjectFile("layouts/partials/home/event-showcase.html");
  const floatingWhatsapp = readProjectFile("layouts/partials/floating-whatsapp.html");

  assert.match(head, /\/js\/analytics-events\.js/);
  assert.match(footer, /Identidade Kwanza/);
  assert.match(footer, /data-analytics-event="external_social_click"/);
  assert.match(footer, /data-analytics-event="click_whatsapp"/);
  assert.doesNotMatch(base, /home\/event-showcase/);
  assert.ok(home.indexOf("home/about.html") < home.indexOf("home/event-showcase.html"));
  assert.match(eventShowcase, /\/internacional-capoeira-kwanza\//);
  assert.match(eventShowcase, /data-analytics-event="click_event_banner"/);
  assert.match(eventShowcase, /home_event_showcase_eyebrow/);
  assert.match(floatingWhatsapp, /data-analytics-event="click_whatsapp"/);
});

test("reconhecimento permanece global e regua aparece somente na pagina internacional", () => {
  const home = readProjectFile("layouts/index.html");
  const footer = readProjectFile("layouts/partials/footer.html");

  assert.doesNotMatch(home, /home\/cultural-recognition\.html/);
  assert.match(footer, /marca_ponto_cultura\.webp/);
  assert.match(footer, /cultural_recognition_eyebrow/);
  assert.match(footer, /cultural_recognition_title/);
  assert.match(footer, /cultural_recognition_footer/);
  assert.match(footer, /if and \.File \(eq \.File\.TranslationBaseName "internacional-capoeira-kwanza"\)[\s\S]*?src="\/img\/eventos\/internacional-2026\/regua_cultura\.webp"[\s\S]*?\{\{ end \}\}/);
  assert.ok(footer.indexOf("footer-seo") < footer.indexOf("footer-funding-strip"));
  assert.doesNotMatch(footer, /pre-certificacao-ponto-cultura\.pdf/);

  ["pt", "en", "es", "de"].forEach((language) => {
    const i18n = readProjectFile(`i18n/${language}.toml`);
    assert.match(i18n, /\[footer_funding_strip_alt\]\s+other =/);
  });
});

test("pagina do evento usa narrativa de retrospectiva e mantem os contratos de analytics", () => {
  const eventPage = readProjectFile("layouts/_default/internacional-capoeira-kwanza.html");
  const mestres = readProjectFile("layouts/partials/evento-kwanza/mestres.html");
  const programacao = readProjectFile("layouts/partials/evento-kwanza/programacao.html");
  const moments = readProjectFile("layouts/partials/evento-kwanza/momentos.html");
  const indicators = readProjectFile("layouts/partials/evento-kwanza/indicadores.html");
  const testimonials = readProjectFile("layouts/partials/evento-kwanza/depoimentos.html");
  const gallery = readProjectFile("layouts/partials/evento-kwanza/galeria.html");
  const videos = readProjectFile("layouts/partials/evento-kwanza/videos.html");
  const mediaSource = readProjectFile("layouts/partials/evento-kwanza/media-source.html");
  const cta = readProjectFile("layouts/partials/evento-kwanza/cta.html");
  const lightbox = readProjectFile("layouts/partials/evento-kwanza/lightbox.html");
  const eventScript = readProjectFile("static/js/internacional-capoeira-kwanza.js");

  assert.match(eventPage, /data-analytics-page-event="event_view"/);
  assert.match(eventPage, /evento-kwanza\/hero\.html/);
  assert.match(eventPage, /evento-kwanza\/momentos\.html/);
  assert.match(eventPage, /evento-kwanza\/galeria\.html/);
  assert.match(eventPage, /evento-kwanza\/videos\.html/);
  assert.match(eventPage, /evento-kwanza\/mestres\.html/);
  assert.match(eventPage, /evento-kwanza\/programacao\.html/);
  assert.match(eventPage, /internacional-capoeira-kwanza\.js/);

  assert.match(mestres, /data-analytics-event="carousel_interaction"/);
  assert.match(mestres, /with \.imagem/);
  assert.match(mestres, /evento-kwanza__mentor-card--text-only/);
  assert.match(mestres, /evento-kwanza__mestres-copy/);
  assert.doesNotMatch(mestres, /class="evento-kwanza__intro"/);
  assert.match(programacao, /data-analytics-event="click_map"/);
  assert.match(programacao, /data-analytics-event="schedule_image_open"/);
  assert.match(programacao, /<details/);
  assert.doesNotMatch(programacao, /<details\b[^>]*\sopen(?:\s|>)/);
  assert.match(moments, /aria-labelledby="momento-titulo-\{\{ \$moment\.id \}\}"/);
  assert.match(moments, /id="momento-titulo-\{\{ \$moment\.id \}\}"/);
  assert.doesNotMatch(moments, /aspectRatio/);
  assert.match(moments, /printf "%02d" \(add \$index 1\)/);
  assert.match(indicators, /status "confirmed"/);
  assert.match(indicators, /ne \(printf "%v" \.valor\) ""/);
  assert.match(indicators, /eq \.status "confirmed"/);
  assert.match(indicators, /not \.demo/);
  assert.doesNotMatch(indicators, /event_demo|demo-caption/);
  assert.match(testimonials, /and \.aprovado \(not \.demo\)/);
  assert.doesNotMatch(testimonials, /event_demo|demo-stamp/);
  assert.match(gallery, /data-analytics-event="event_gallery_open"/);
  assert.match(gallery, /evento-kwanza\/media-source\.html/);
  assert.doesNotMatch(gallery, /event_demo|demo-caption|demo-stamp/);
  assert.match(mediaSource, /os\.FileExists/);
  assert.match(mediaSource, /\.demoMedia/);
  assert.match(lightbox, /data-lightbox-prev/);
  assert.match(lightbox, /data-lightbox-next/);
  assert.match(cta, /event_learn_cta_click/);
  assert.match(cta, /href="\{\{ relLangURL "\/contatos\/" \}\}"[^>]*data-analytics-param-cta-label="conheca_nossas_aulas"/);
  assert.ok(cta.includes('relLangURL "/equipe-kwanza/"'));
  assert.match(videos, /event_video_play/);
  assert.match(videos, /\$hasPlayback := and \$providerSupported \(or \.url \.identificador\)/);
  assert.match(videos, /\$hasDemoThumbnail := and \$\.demoMedia \$media\.demo/);
  assert.match(videos, /if \.hasLocalVideo[\s\S]*?<video controls[\s\S]*?else if \.hasPlayback[\s\S]*?else if \$thumb/);
  assert.doesNotMatch(videos, /event_demo|video-placeholder/);
  assert.doesNotMatch(videos, /<iframe/);
  assert.doesNotMatch(eventPage, /demo-note/);
  assert.match(eventPage, /and \.Params\.feature_flags\.demo_media \(ne hugo\.Environment "production"\)/);
  assert.match(eventScript, /schedule_image_close/);
  assert.match(eventScript, /ArrowRight/);
  assert.match(eventScript, /new URL\(rawUrl\)/);
});

test("modelo do evento separa valores de demonstracao do conteudo real", () => {
  const eventFiles = [
    { path: "content/internacional-capoeira-kwanza.md", language: "pt" },
    { path: "content/internacional-capoeira-kwanza.en.md", language: "en" },
    { path: "content/internacional-capoeira-kwanza.es.md", language: "es" },
    { path: "content/internacional-capoeira-kwanza.de.md", language: "de" },
  ];

  eventFiles.forEach(({ path: filePath, language }) => {
    const content = readProjectFile(filePath);
    assert.match(content, /demo_media: false/);
    assert.doesNotMatch(content, /internacional-2026-demo|imagem_demo:|miniatura_demo:|sharing_image_demo:/);
    assert.match(content, /status: "demo"/);
    assert.match(content, /status: "unconfirmed"/);
    assert.match(content, /- id: participantes\s+valor: 500\s+status: "confirmed"\s+demo: false/);
    assert.match(content, /- id: graduacoes\s+valor: 62\s+status: "confirmed"\s+demo: false/);
    assert.match(content, /- id: oficinas_programadas\s+valor: 5\s+status: "confirmed"\s+demo: false/);
    const momentData = content.match(/momentos:\n([\s\S]*?)\ngaleria:/)?.[1] || "";
    assert.deepEqual(
      [...momentData.matchAll(/^  - id: "([^"]+)"/gm)].map((match) => match[1]),
      ["formacao", "reconhecimento", "roda-de-rua", "batizado-formatura"],
    );
    assert.match(content, /arquivo_historico:/);
    assert.match(content, /formados_mestres:/);
    assert.match(content, /- nome: "Professor Bom Cabelo"/);
    assert.match(content, /- nome: "Monitora Cabloca"/);
    assert.match(content, /- nome: "Professor Gafanhoto"\s+imagem: "\/img\/eventos\/internacional-2026\/gafanhoto\.png"/);
    assert.match(content, /- nome: "Professora Guerreira"\s+imagem: "\/img\/eventos\/internacional-2026\/guerreira\.png"/);
    ["vivencias", "roda", "cerimonias"].forEach((id) => {
      assert.ok(content.includes(`arquivo: "/img/eventos/internacional-2026/video-${id}-otimizado.mp4"`), `${filePath} should configure local video ${id}`);
    });
    assert.doesNotMatch(content, /Mestre Sertão|sertao\.png/i);
    [
      "retrospectiva-capa.webp", "kwanza-em-movimento.webp",
      "momento-formacao-vivencias.webp", "momento-reconhecimento.webp",
      "momento-roda-de-rua.webp", "momento-batizado-formatura.webp",
      "galeria-01-vivencias.webp", "galeria-02-cerimonias.webp",
      "galeria-03-roda-de-rua.webp", "galeria-04-batizado.webp",
      "galeria-05-encontro-coletivo.webp", "galeria-06-musica-e-movimento.webp",
      "galeria-07-aprendizagem.webp", "galeria-08-espaco-publico.webp",
      "galeria-09-roda.webp", "galeria-10-celebracao.webp",
      "galeria-11-movimento-expressao.webp", "galeria-12-comunidade.webp",
      "video-vivencias.webp", "video-roda.webp", "video-cerimonias.webp",
    ].forEach((filename) => {
      assert.ok(content.includes(`/img/eventos/internacional-2026/${filename}`), `${filePath} should configure ${filename}`);
    });
    assert.match(content, /sharing_image: "\/img\/eventos\/internacional-2026\/retrospectiva-capa\.webp"/);
    assert.doesNotMatch(content, /descricao: .*não confirma uma graduação|does not confirm that a graduation|no confirma que se haya realizado una graduación|bestätigt keine tatsächlich erfolgte Graduierung/i);
    assert.doesNotMatch(content, /presença nesta agenda não confirma|does not, by itself, confirm|no confirma, por sí sola|bestätigt für sich genommen nicht/i);
    assert.equal((content.match(/^  - id: "registro-/gm) || []).length, 12);
    assert.doesNotMatch(content, /youtube\.com|youtu\.be|vimeo\.com/);

    const testimonialContent = content.match(/depoimentos:\n([\s\S]*?)\narquivo_historico:/)?.[1] || "";
    assert.equal((testimonialContent.match(/id: "depoimento-0[1-3]"/g) || []).length, 3);
    assert.equal((testimonialContent.match(/aprovado: true/g) || []).length, 3);
    assert.equal((testimonialContent.match(/demo: false/g) || []).length, 3);
    assert.doesNotMatch(testimonialContent, /@mestre jaguara/i);
  });

  assert.ok(fs.existsSync(path.join(rootDir, "static/img/eventos/internacional-2026/gafanhoto.png")));
  const portugueseContent = readProjectFile("content/internacional-capoeira-kwanza.md");
  const gallery = portugueseContent.match(/galeria:\n([\s\S]*?)\nvideos:/)?.[1] || "";
  assert.doesNotMatch(gallery, /Imagem demonstrativa|não é uma fotografia/);
  assert.equal((gallery.match(/^    alt: "/gm) || []).length, 12);
});

test("retrospectiva e showcase existem nos quatro idiomas sem fallback de texto", () => {
  const expectedTitles = {
    pt: "Internacional Capoeira Kwanza 2026",
    en: "International Capoeira Kwanza 2026",
    es: "Internacional Capoeira Kwanza 2026",
    de: "Internationale Capoeira Kwanza 2026",
  };
  const keys = [
    "event_cta_title", "event_archive_title", "event_gallery_title",
    "event_indicators_title", "event_metric_oficinas_programadas", "home_event_showcase_text",
  ];

  Object.entries(expectedTitles).forEach(([language, title]) => {
    const content = readProjectFile(`content/internacional-capoeira-kwanza${language === "pt" ? "" : `.${language}`}.md`);
    assert.ok(content.includes(`title: "${title}"`));
    const i18n = readProjectFile(`i18n/${language}.toml`);
    keys.forEach((key) => assert.match(i18n, new RegExp(`\\[${key}\\]\\s+other =`)));
  });
});

test("CTAs e componentes interativos possuem pontos de analytics", () => {
  const projectHero = readProjectFile("layouts/partials/vem-aprender/hero.html");
  const navigation = readProjectFile("layouts/partials/nav.html");
  const languageSwitcher = readProjectFile("layouts/partials/lang-switcher.html");
  const homeAbout = readProjectFile("layouts/partials/home/about.html");
  const songShortcode = readProjectFile("layouts/shortcodes/musica.html");
  const founderStory = readProjectFile("layouts/partials/equipe/historia-mestre.html");
  const analytics = readProjectFile("static/js/analytics-events.js");

  assert.match(projectHero, /data-analytics-param-cta-label="vem_aprender_hero"/);
  assert.match(projectHero, /data-analytics-param-carousel-name="vem_aprender_hero"/);
  assert.match(navigation, /data-analytics-event="navigation_toggle"/);
  assert.match(navigation, /data-analytics-event="navigation_click"/);
  assert.match(languageSwitcher, /data-analytics-event="language_switch"/);
  assert.match(languageSwitcher, /if ne \.Language\.Lang \$\.Language\.Lang/);
  assert.match(homeAbout, /data-analytics-component="faq"/);
  assert.match(songShortcode, /data-analytics-component="song_lyrics"/);
  assert.match(songShortcode, /data-analytics-media="audio"/);
  assert.match(songShortcode, /enablejsapi=1/);
  assert.match(founderStory, /enablejsapi=1/);
  assert.match(analytics, /content_link_click/);
  assert.match(analytics, /content_component_toggle/);
  assert.match(analytics, /content_media_start/);
});

test("links que abrem nova aba usam protecao contra window.opener", () => {
  const templateFiles = listFiles("layouts", ".html");
  const targetBlankPattern = /<a\b[^>]*target="_blank"[^>]*>/g;

  templateFiles.forEach((filePath) => {
    const content = readProjectFile(filePath);
    const matches = content.matchAll(targetBlankPattern);

    for (const match of matches) {
      assert.match(
        match[0],
        /rel="noopener noreferrer"/,
        `${filePath} contem link target=_blank sem rel seguro: ${match[0]}`
      );
    }
  });
});

test("imagens do evento mantem alt, lazy loading e decoding assincrono", () => {
  const partials = [
    readProjectFile("layouts/partials/evento-kwanza/mestres.html"),
    readProjectFile("layouts/partials/evento-kwanza/programacao.html"),
  ].join("\n");

  const imageTags = partials.match(/<img\b[^>]*>/g) || [];
  assert.ok(imageTags.length > 0);

  imageTags.forEach((tag) => {
    assert.match(tag, /\balt="/);
    assert.match(tag, /\bloading="lazy"/);
    assert.match(tag, /\bdecoding="async"/);
  });
});

test("todas as paginas de conteudo em portugues possuem versoes ingles, espanhol e alemao", () => {
  const contentFiles = listFiles("content", ".md");
  const defaultLanguageFiles = contentFiles.filter(
    (filePath) =>
      !filePath.endsWith(".en.md") &&
      !filePath.endsWith(".es.md") &&
      !filePath.endsWith(".de.md")
  );

  defaultLanguageFiles.forEach((filePath) => {
    const basePath = filePath.replace(/\.md$/, "");
    assert.ok(
      fs.existsSync(path.join(rootDir, `${basePath}.en.md`)),
      `${filePath} nao possui traducao em ingles`
    );
    assert.ok(
      fs.existsSync(path.join(rootDir, `${basePath}.es.md`)),
      `${filePath} nao possui traducao em espanhol`
    );
    assert.ok(
      fs.existsSync(path.join(rootDir, `${basePath}.de.md`)),
      `${filePath} nao possui traducao em alemao`
    );
  });
});

test("seletor de idiomas exibe as quatro mini bandeiras", () => {
  const switcher = readProjectFile("layouts/partials/lang-switcher.html");

  assert.match(switcher, /\.AllTranslations/);
  assert.match(switcher, /href="{{ \.RelPermalink }}"/);
  assert.doesNotMatch(switcher, /href="{{ \.Permalink }}"/);
  assert.match(switcher, /aria-current="page"/);
  ["brz_mini.webp", "eua_mini.webp", "esp_mini.webp", "ale_mini.png"].forEach(
    (flag) => assert.match(switcher, new RegExp(`img/flags/${flag}`))
  );
});

test("navegacao preserva espaco entre logo e menu", () => {
  const navigation = readProjectFile("static/css/components/navigation.css");

  assert.match(navigation, /\.nav-container\s*{[^}]*gap:\s*24px;/s);
  assert.match(navigation, /\.nav-logo\s*{[^}]*flex-shrink:\s*0;/s);
  assert.match(navigation, /@media \(max-width:\s*1400px\)/);
});

test("SEO multilingue inclui alemao e alternates completos", () => {
  const head = readProjectFile("layouts/partials/head.html");
  const llms = readProjectFile("static/llms.txt");

  assert.match(head, /cond \(eq \.Lang "de"\) "de_DE"/);
  assert.match(head, /range \.AllTranslations/);
  assert.match(head, /hreflang="x-default" href="{{ \$xDefault }}"/);
  assert.match(head, /og:image:alt/);
  assert.match(head, /twitter:image:alt/);
  assert.match(llms, /German \(de-DE\)/);
  assert.match(llms, /https:\/\/grupokwanza\.com\.br\/de\//);
});

test("vitrine da home e retrospectiva possuem regras responsivas e foco visivel", () => {
  const showcase = readProjectFile("static/css/sections/home-event-showcase.css");
  const retrospective = readProjectFile("static/css/pages/internacional-capoeira-kwanza.css");

  assert.match(showcase, /\.home-event-showcase__link\s*{[^}]*grid-template-columns/s);
  assert.match(showcase, /@media \(max-width: 760px\)/);
  assert.match(showcase, /\.home-event-showcase__link:focus-visible/);
  assert.match(retrospective, /\.evento-kwanza__gallery-grid/);
  assert.match(retrospective, /@media \(max-width: 720px\)/);
  assert.match(retrospective, /prefers-reduced-motion: reduce/);
  assert.match(retrospective, /\.evento-kwanza :focus-visible/);
  assert.match(retrospective, /@media \(min-width: 721px\) and \(max-width: 860px\)[\s\S]*?\.evento-kwanza__hero-meta \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/);
  assert.match(retrospective, /\.evento-kwanza__carousel-dot \{[\s\S]*?width: 24px;[\s\S]*?height: 24px;/);
  assert.match(retrospective, /grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 12rem\), 1fr\)\)/);
  assert.match(retrospective, /.evento-kwanza__indicators \.evento-kwanza__section-header \{[\s\S]*?text-align: center/);
  assert.match(retrospective, /.evento-kwanza__indicator:first-child \{\s*border-inline-start: 0/);
  assert.match(retrospective, /@media \(max-width: 720px\)[\s\S]*?\.evento-kwanza__indicator-grid \{ grid-template-columns: 1fr/);
  assert.match(retrospective, /max-width: 26ch/);
  assert.match(retrospective, /\.evento-kwanza__intro-copy p \{[\s\S]*?color: var\(--text-editorial-copy\)/);
  assert.match(retrospective, /\.evento-kwanza__cta \.container \{\s*max-width: 900px/);
  assert.match(retrospective, /\.evento-kwanza__video-grid,\s*\.evento-kwanza__testimonial-grid \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(retrospective, /\.evento-kwanza__testimonial:first-child \{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?grid-template-columns: minmax\(0, 1fr\) minmax\(12rem, 0\.35fr\)/);
  assert.match(retrospective, /@media \(max-width: 900px\)[\s\S]*?\.evento-kwanza__testimonial:first-child \{ grid-template-columns: 1fr; \}/);
  assert.match(retrospective, /\.evento-kwanza__moment-list \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(retrospective, /\.evento-kwanza__moments \.evento-kwanza__section-header \{[\s\S]*?max-width: none/);
  assert.match(retrospective, /\.evento-kwanza__figure--moment \.evento-kwanza__image-frame \{[\s\S]*?aspect-ratio: 4 \/ 3;[\s\S]*?border-radius:/);
  assert.match(retrospective, /@media \(max-width: 720px\)[\s\S]*?\.evento-kwanza__moment-list \{ grid-template-columns: 1fr/);
  assert.doesNotMatch(retrospective, /evento-kwanza__demo-note|evento-kwanza__demo-caption|evento-kwanza__honoree-note/);
});
