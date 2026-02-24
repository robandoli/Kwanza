"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

function loadNavScript(document) {
  const scriptPath = path.join(__dirname, "../../../static/js/nav-toggle.js");
  const code = fs.readFileSync(scriptPath, "utf8");
  vm.runInNewContext(code, { document, console }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

test("abre e fecha menu mobile atualizando aria-expanded", () => {
  const document = new FakeDocument();
  const toggle = new FakeElement("button", { className: "nav-toggle" });
  const menu = new FakeElement("ul", { className: "nav-menu" });

  document.body.appendChild(toggle);
  document.body.appendChild(menu);

  loadNavScript(document);

  toggle.dispatchEvent({ type: "click" });
  assert.equal(menu.classList.contains("open"), true);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");

  toggle.dispatchEvent({ type: "click" });
  assert.equal(menu.classList.contains("open"), false);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
});

