"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

function loadAnalyticsScript({ document, window }) {
  const scriptPath = path.join(__dirname, "../../../static/js/analytics-events.js");
  const code = fs.readFileSync(scriptPath, "utf8");

  vm.runInNewContext(code, { document, window, URL }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

function plainObject(value) {
  return JSON.parse(JSON.stringify(value));
}

test("envia evento de página com parâmetros padronizados", () => {
  const calls = [];
  const document = new FakeDocument();
  const pageMarker = new FakeElement("article");

  document.title = "Internacional Capoeira Kwanza";
  pageMarker.dataset.analyticsPageEvent = "event_view";
  pageMarker.dataset.analyticsParamEventName = "internacional_capoeira_kwanza";
  document.body.appendChild(pageMarker);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/internacional-capoeira-kwanza/" },
      gtag: (...args) => calls.push(args),
    },
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "event");
  assert.equal(calls[0][1], "event_view");
  assert.deepEqual(plainObject(calls[0][2]), {
    page_path: "/internacional-capoeira-kwanza/",
    page_title: "Internacional Capoeira Kwanza",
    event_name: "internacional_capoeira_kwanza",
  });
});

test("envia evento de clique a partir do elemento clicado ou ancestral", () => {
  const calls = [];
  const document = new FakeDocument();
  const link = new FakeElement("a");
  const icon = new FakeElement("span");

  document.title = "Contatos";
  link.href = "https://wa.me/11995240710?text=hello";
  link.dataset.analyticsEvent = "click_whatsapp";
  link.dataset.analyticsParamCtaLabel = "whatsapp_rodape";
  link.dataset.analyticsParamPageSection = "footer";
  link.appendChild(icon);
  document.body.appendChild(link);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/contatos/" },
      URL,
      gtag: (...args) => calls.push(args),
    },
  });

  document.dispatchEvent({ type: "click", target: icon });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], "click_whatsapp");
  assert.deepEqual(plainObject(calls[0][2]), {
    page_path: "/contatos/",
    page_title: "Contatos",
    cta_label: "whatsapp_rodape",
    page_section: "footer",
    link_type: "external",
    link_url: "https://wa.me",
  });
});

test("registra cliques editoriais sem enviar a query do destino", () => {
  const calls = [];
  const document = new FakeDocument();
  const component = new FakeElement("nav");
  const link = new FakeElement("a", { textContent: "Sistema de graduações" });
  const icon = new FakeElement("span");

  component.dataset.analyticsComponent = "guide_navigation";
  link.href = "/guia-do-capoeirista-kwanza/sistema-de-graduacoes/?phone=5511999999999";
  link.appendChild(icon);
  component.appendChild(link);
  document.body.appendChild(component);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/guia-do-capoeirista-kwanza/", origin: "https://kwanza.test" },
      URL,
      gtag: (...args) => calls.push(args),
    },
  });

  document.dispatchEvent({ type: "click", target: icon });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], "content_link_click");
  assert.deepEqual(plainObject(calls[0][2]), {
    page_path: "/guia-do-capoeirista-kwanza/",
    page_title: "",
    component_name: "guide_navigation",
    link_label: "Sistema de graduações",
    link_type: "internal",
    link_url: "/guia-do-capoeirista-kwanza/sistema-de-graduacoes/",
  });
});

test("registra expansão e recolhimento de componentes details instrumentados", () => {
  const calls = [];
  const document = new FakeDocument();
  const details = new FakeElement("details");

  details.dataset.analyticsComponent = "faq";
  details.dataset.analyticsParamComponentItem = "question_1";
  details.open = true;
  document.body.appendChild(details);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/" },
      URL,
      gtag: (...args) => calls.push(args),
    },
  });

  document.dispatchEvent({ type: "toggle", target: details });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], "content_component_toggle");
  assert.equal(calls[0][2].component_name, "faq");
  assert.equal(calls[0][2].component_item, "question_1");
  assert.equal(calls[0][2].component_action, "open");
});

test("registra início e conclusão de reprodução de mídia instrumentada", () => {
  const calls = [];
  const document = new FakeDocument();
  const audio = new FakeElement("audio");

  audio.dataset.analyticsMedia = "audio";
  audio.dataset.analyticsComponent = "song_audio";
  audio.dataset.analyticsParamContentName = "Toque de Angola";
  document.body.appendChild(audio);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/guia-do-capoeirista-kwanza/cantigas/" },
      gtag: (...args) => calls.push(args),
    },
  });

  audio.dispatchEvent({ type: "play" });
  audio.dispatchEvent({ type: "play" });
  audio.dispatchEvent({ type: "ended" });

  assert.deepEqual(calls.map((call) => call[1]), ["content_media_start", "content_media_complete"]);
  assert.equal(calls[0][2].component_name, "song_audio");
  assert.equal(calls[0][2].content_name, "Toque de Angola");
  assert.equal(calls[1][2].media_type, "audio");
});

test("nao quebra quando o gtag nao existe", () => {
  const document = new FakeDocument();
  const button = new FakeElement("button");

  button.dataset.analyticsEvent = "click_map";
  document.body.appendChild(button);

  assert.doesNotThrow(() => {
    loadAnalyticsScript({
      document,
      window: { location: { pathname: "/" } },
    });
    document.dispatchEvent({ type: "click", target: button });
  });
});
