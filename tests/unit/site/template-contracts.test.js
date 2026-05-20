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
  const footer = readProjectFile("layouts/partials/footer.html");
  const eventBanner = readProjectFile("layouts/partials/home/event-banner.html");
  const floatingWhatsapp = readProjectFile("layouts/partials/floating-whatsapp.html");

  assert.match(head, /\/js\/analytics-events\.js/);
  assert.match(footer, /Identidade Kwanza/);
  assert.match(footer, /data-analytics-event="external_social_click"/);
  assert.match(footer, /data-analytics-event="click_whatsapp"/);
  assert.match(eventBanner, /\/internacional-capoeira-kwanza\//);
  assert.match(eventBanner, /data-analytics-event="click_event_banner"/);
  assert.match(floatingWhatsapp, /data-analytics-event="click_whatsapp"/);
});

test("pagina do evento internacional preserva CTAs, mapas, galeria e analytics", () => {
  const eventPage = readProjectFile("layouts/_default/internacional-capoeira-kwanza.html");
  const mestres = readProjectFile("layouts/partials/evento-kwanza/mestres.html");
  const programacao = readProjectFile("layouts/partials/evento-kwanza/programacao.html");
  const info = readProjectFile("layouts/partials/evento-kwanza/info.html");
  const floating = readProjectFile("layouts/partials/evento-kwanza/floating-whatsapp.html");
  const lightbox = readProjectFile("layouts/partials/evento-kwanza/lightbox.html");

  assert.match(eventPage, /data-analytics-page-event="event_view"/);
  assert.match(eventPage, /evento-kwanza\/hero\.html/);
  assert.match(eventPage, /evento-kwanza\/mestres\.html/);
  assert.match(eventPage, /evento-kwanza\/programacao\.html/);
  assert.match(eventPage, /evento-kwanza\/info\.html/);
  assert.match(eventPage, /internacional-capoeira-kwanza\.js/);

  assert.match(mestres, /data-analytics-event="carousel_interaction"/);
  assert.match(programacao, /data-analytics-event="click_map"/);
  assert.match(programacao, /data-analytics-event="schedule_image_open"/);
  assert.match(info, /event_primary_cta/);
  assert.match(info, /data-analytics-param-cta-label="contato_card"/);
  assert.match(floating, /data-analytics-param-cta-label="whatsapp_flutuante_evento"/);
  assert.match(lightbox, /data-lightbox/);
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

test("todas as paginas de conteudo em portugues possuem versoes ingles e espanhol", () => {
  const contentFiles = listFiles("content", ".md");
  const defaultLanguageFiles = contentFiles.filter(
    (filePath) => !filePath.endsWith(".en.md") && !filePath.endsWith(".es.md")
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
  });
});
