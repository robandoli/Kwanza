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

  vm.runInNewContext(code, { document, window }, { filename: scriptPath });
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
  link.href = "https://wa.me/11995240710";
  link.dataset.analyticsEvent = "click_whatsapp";
  link.dataset.analyticsParamCtaLabel = "whatsapp_rodape";
  link.dataset.analyticsParamPageSection = "footer";
  link.appendChild(icon);
  document.body.appendChild(link);

  loadAnalyticsScript({
    document,
    window: {
      location: { pathname: "/contatos/" },
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
    link_url: "https://wa.me/11995240710",
  });
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
