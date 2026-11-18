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

function runScript(document, analyticsCalls = [], innerWidth = 1366) {
  vm.runInNewContext(code, {
    document,
    URL,
    window: {
      innerWidth,
      getComputedStyle: () => ({ columnGap: "0", gap: "0" }),
      trackKwanzaAnalytics: (...args) => analyticsCalls.push(args),
    },
  }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

test("carrossel responde ao deslize horizontal e preserva rolagem vertical e limites", () => {
  const calls = [];
  const document = new FakeDocument();
  const carousel = addData(new FakeElement("div"), "mestresCarousel");
  const viewport = addData(new FakeElement("div"), "carouselViewport");
  const track = addData(new FakeElement("div"), "carouselTrack");
  const previous = addData(new FakeElement("button"), "carouselPrev");
  const next = addData(new FakeElement("button"), "carouselNext");
  const dots = addData(new FakeElement("div"), "carouselDots");
  for (let i = 0; i < 3; i += 1) {
    const card = new FakeElement("article");
    card.getBoundingClientRect = () => ({ width: 300 });
    track.appendChild(card);
  }
  viewport.appendChild(track);
  [previous, next, viewport, dots].forEach((element) => carousel.appendChild(element));
  document.body.appendChild(carousel);
  runScript(document, calls, 375);

  const touch = (x, y, identifier = 1) => ({ clientX: x, clientY: y, identifier });
  const swipe = (start, end) => {
    viewport.dispatchEvent({ type: "touchstart", touches: [start] });
    viewport.dispatchEvent({ type: "touchend", touches: [], changedTouches: [end] });
  };
  assert.equal(track.style.transform, "translateX(-0px)");
  swipe(touch(250, 100), touch(120, 110));
  assert.equal(track.style.transform, "translateX(-300px)");
  assert.equal(previous.disabled, false);
  assert.equal(dots.children[1].getAttribute("aria-pressed"), "true");
  swipe(touch(250, 100), touch(230, 110));
  swipe(touch(250, 100), touch(180, 220));
  assert.equal(track.style.transform, "translateX(-300px)");
  swipe(touch(100, 100), touch(220, 105));
  swipe(touch(100, 100), touch(220, 105));
  assert.equal(track.style.transform, "translateX(-0px)");
  assert.equal(previous.disabled, true);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["carousel_interaction", { carousel_name: "formados_mestres", carousel_action: "swipe_next" }],
    ["carousel_interaction", { carousel_name: "formados_mestres", carousel_action: "swipe_previous" }],
  ]);
  viewport.dispatchEvent({ type: "touchstart", touches: [touch(250, 100)] });
  viewport.dispatchEvent({ type: "touchcancel" });
  viewport.dispatchEvent({ type: "touchend", touches: [], changedTouches: [touch(100, 100)] });
  assert.equal(track.style.transform, "translateX(-0px)");
  next.dispatchEvent({ type: "click" });
  assert.equal(track.style.transform, "translateX(-300px)");
});

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
