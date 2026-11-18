"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

const rootDir = path.join(__dirname, "../../..");

function runScript(filePath, context) {
  const scriptPath = path.join(rootDir, filePath);
  vm.runInNewContext(fs.readFileSync(scriptPath, "utf8"), context, { filename: scriptPath });
}

test("inicializa o GA4 e preserva a fila existente", () => {
  const existingQueue = [["previous"]];
  const window = { dataLayer: existingQueue };
  const document = { currentScript: { dataset: { measurementId: "G-TEST123" } } };

  runScript("static/js/gtag-init.js", { document, window });

  assert.equal(window.dataLayer, existingQueue);
  assert.equal(existingQueue[0][0], "previous");
  assert.equal(existingQueue[1][0], "js");
  assert.equal(existingQueue[2][0], "config");
  assert.equal(existingQueue[2][1], "G-TEST123");

  window.gtag("event", "test_event");
  assert.equal(existingQueue[3][0], "event");
  assert.equal(existingQueue[3][1], "test_event");
});

test("não inicializa o GA4 sem identificador de medição", () => {
  const window = {};
  const document = { currentScript: { dataset: {} } };

  runScript("static/js/gtag-init.js", { document, window });

  assert.equal(window.gtag, undefined);
  assert.equal(window.dataLayer, undefined);
});

test("o evento da página chega à fila do GA4 após a inicialização externa", () => {
  const document = new FakeDocument();
  const window = { location: { pathname: "/internacional-capoeira-kwanza/" } };
  const marker = new FakeElement("article");
  document.currentScript = { dataset: { measurementId: "G-TEST123" } };
  document.title = "Internacional Capoeira Kwanza";
  marker.dataset.analyticsPageEvent = "event_view";
  marker.dataset.analyticsParamEventName = "internacional_capoeira_kwanza";
  document.body.appendChild(marker);

  runScript("static/js/gtag-init.js", { document, window });
  runScript("static/js/analytics-events.js", { document, window, URL });
  document.dispatchDOMContentLoaded();

  assert.equal(window.dataLayer[2][0], "event");
  assert.equal(window.dataLayer[2][1], "event_view");
  assert.equal(window.dataLayer[2][2].event_context, "internacional_capoeira_kwanza");
});

test("a página 404 mantém o emoji sem exigir script inline", () => {
  const container = { textContent: "" };
  const document = { querySelector: () => container };
  const random = { floor: Math.floor, random: () => 0 };

  runScript("static/js/error-404.js", { document, Math: random });

  assert.equal(container.textContent, "\\(o_o)/");
});
