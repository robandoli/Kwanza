"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

test("registra quando a lightbox da programação é fechada", () => {
  const calls = [];
  const document = new FakeDocument();
  const lightbox = new FakeElement("dialog");
  lightbox.setAttribute("data-lightbox", "true");
  document.body.appendChild(lightbox);

  const scriptPath = path.join(__dirname, "../../../static/js/internacional-capoeira-kwanza.js");
  const code = fs.readFileSync(scriptPath, "utf8");
  vm.runInNewContext(code, {
    document,
    window: {
      trackKwanzaAnalytics: (...args) => calls.push(args),
    },
  }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();

  lightbox.dispatchEvent({ type: "close" });

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "schedule_image_close");
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][1])), {
    event_name: "internacional_capoeira_kwanza",
    component_name: "event_activity_lightbox",
    page_section: "programacao",
  });
});
