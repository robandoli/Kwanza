"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

const scriptPath = path.join(__dirname, "../../../static/js/internacional-capoeira-kwanza.js");
const code = fs.readFileSync(scriptPath, "utf8");

function addData(element, name, value = "") {
  element.dataset[name] = value;
  const attribute = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  element.setAttribute(`data-${attribute}`, value);
  return element;
}

function addLightbox(document) {
  const dialog = addData(new FakeElement("dialog"), "lightbox");
  const image = addData(new FakeElement("img"), "lightboxImage");
  const caption = addData(new FakeElement("figcaption"), "lightboxCaption");
  const close = addData(new FakeElement("button"), "lightboxClose");
  dialog.open = false;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent({ type: "close" });
  };
  dialog.appendChild(image);
  dialog.appendChild(caption);
  dialog.appendChild(close);
  document.body.appendChild(dialog);
  return { dialog, image, caption, close };
}

function addOpener(document, { group, src, alt, caption }) {
  const button = addData(new FakeElement("button"), "lightboxOpen");
  addData(button, "lightboxGroup", group);
  addData(button, "lightboxSrc", src);
  addData(button, "lightboxAlt", alt);
  addData(button, "lightboxCaption", caption);
  document.body.appendChild(button);
  return button;
}

function runScript(document, analyticsCalls = []) {
  vm.runInNewContext(code, {
    document,
    URL,
    window: {
      innerWidth: 1366,
      getComputedStyle: () => ({ columnGap: "0", gap: "0" }),
      trackKwanzaAnalytics: (...args) => analyticsCalls.push(args),
    },
  }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

test("registra o fechamento do cartaz historico e devolve o foco ao acionador", () => {
  const calls = [];
  const document = new FakeDocument();
  const { dialog, close } = addLightbox(document);
  const opener = addOpener(document, {
    group: "schedule",
    src: "/img/schedule.svg",
    alt: "Cartaz da programação prevista",
    caption: "Aula demonstrativa",
  });

  runScript(document, calls);
  opener.dispatchEvent({ type: "click" });
  assert.equal(dialog.open, true);
  assert.equal(close._focused, undefined);
  dialog.close();

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "schedule_image_close");
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][1])), {
    event_name: "internacional_capoeira_kwanza",
    component_name: "event_activity_lightbox",
    page_section: "arquivo_historico",
  });
  assert.equal(opener._focused, true);
});

test("galeria navega por setas e permite fechar com Escape nativo do dialog", () => {
  const document = new FakeDocument();
  const { dialog, image, caption } = addLightbox(document);
  const first = addOpener(document, { group: "gallery", src: "/img/01.svg", alt: "Imagem um", caption: "Vivências" });
  const second = addOpener(document, { group: "gallery", src: "/img/02.svg", alt: "Imagem dois", caption: "Roda" });

  runScript(document);
  first.dispatchEvent({ type: "click" });
  assert.equal(image.src, "/img/01.svg");
  assert.equal(caption.textContent, "Vivências");

  let prevented = false;
  dialog.dispatchEvent({ type: "keydown", key: "ArrowRight", preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(image.src, "/img/02.svg");
  assert.equal(second._focused, true);

  prevented = false;
  dialog.dispatchEvent({ type: "keydown", key: "Escape", preventDefault: () => { prevented = true; } });
  assert.equal(prevented, false);
  dialog.close();
  assert.equal(second._focused, true);
});

test("imagens exibem estado de erro quando a carga falha", () => {
  const document = new FakeDocument();
  const frame = addData(new FakeElement("div"), "imageFrame");
  const image = addData(new FakeElement("img"), "eventImage");
  const error = addData(new FakeElement("span"), "imageError");
  error.hidden = true;
  frame.appendChild(image);
  frame.appendChild(error);
  document.body.appendChild(frame);

  runScript(document);
  image.dispatchEvent({ type: "error" });

  assert.equal(frame.classList.contains("has-error"), true);
  assert.equal(image.hidden, true);
  assert.equal(error.hidden, false);
});

test("reproducao de video local registra a categoria no analytics", () => {
  const calls = [];
  const document = new FakeDocument();
  const video = addData(new FakeElement("video"), "eventLocalVideo");
  addData(video, "analyticsParamEventName", "internacional_capoeira_kwanza");
  addData(video, "analyticsParamVideoCategory", "roda");
  document.body.appendChild(video);

  runScript(document, calls);
  assert.equal(calls.length, 0);
  video.dispatchEvent({ type: "play" });
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [["event_video_play", {
    event_name: "internacional_capoeira_kwanza",
    video_category: "roda",
  }]]);
});

test("video so e incorporado depois do clique e com provedor e identificador validos", () => {
  const calls = [];
  const document = new FakeDocument();
  const frame = new FakeElement("div");
  const button = addData(new FakeElement("button"), "videoLoad");
  addData(button, "videoProvider", "youtube");
  addData(button, "videoId", "abcdefghijk");
  addData(button, "videoTitle", "Roda Kwanza");
  addData(button, "analyticsParamEventName", "internacional_capoeira_kwanza");
  addData(button, "analyticsParamVideoCategory", "roda");
  button.replaceWith = (replacement) => {
    const index = frame.children.indexOf(button);
    replacement.parentNode = frame;
    frame.children[index] = replacement;
  };
  frame.appendChild(button);
  document.body.appendChild(frame);

  runScript(document, calls);
  assert.equal(frame.children.length, 1);
  assert.equal(frame.children[0], button);
  button.dispatchEvent({ type: "click" });

  const iframe = frame.children[0];
  assert.equal(iframe.tagName, "IFRAME");
  assert.equal(iframe.src, "https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&playsinline=1&rel=0");
  assert.equal(iframe.title, "Roda Kwanza");
  assert.equal(iframe.loading, "lazy");
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [["event_video_play", {
    event_name: "internacional_capoeira_kwanza",
    video_category: "roda",
  }]]);
});

test("URLs de video fora da lista segura nao geram iframe", () => {
  const calls = [];
  const document = new FakeDocument();
  const frame = new FakeElement("div");
  const button = addData(new FakeElement("button"), "videoLoad");
  addData(button, "videoProvider", "youtube");
  addData(button, "videoUrl", "https://videos.example.org/watch?v=abcdefghijk");
  button.replaceWith = () => assert.fail("invalid video URL must not be embedded");
  frame.appendChild(button);
  document.body.appendChild(frame);

  runScript(document, calls);
  button.dispatchEvent({ type: "click" });

  assert.equal(button.disabled, true);
  assert.equal(button.getAttribute("aria-disabled"), "true");
  assert.equal(calls.length, 0);
});
