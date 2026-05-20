"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("../../helpers/fake-dom");

function createHero({ className = "hero", interval = "", activeIndex = 0 } = {}) {
  const hero = new FakeElement("section", { className });
  const bg = new FakeElement("div", { className: "hero-bg" });
  const prev = new FakeElement("button");
  const next = new FakeElement("button");

  if (interval) hero.dataset.carouselInterval = interval;
  prev.dataset.carouselPrev = "";
  next.dataset.carouselNext = "";

  ["primeiro", "segundo", "terceiro"].forEach((label, index) => {
    const img = new FakeElement("img");
    img.setAttribute("alt", label);
    if (index === activeIndex) img.classList.add("active");
    bg.appendChild(img);
  });

  hero.appendChild(bg);
  hero.appendChild(prev);
  hero.appendChild(next);

  return { hero, slides: bg.querySelectorAll("img"), prev, next };
}

function loadHeroCarousel({ document, window }) {
  const scriptPath = path.join(__dirname, "../../../static/js/hero-carousel.js");
  const code = fs.readFileSync(scriptPath, "utf8");

  vm.runInNewContext(code, { document, window }, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

test("inicializa todos os heroes e respeita intervalo configurado", () => {
  const document = new FakeDocument();
  const intervals = [];
  const home = createHero();
  const vemAprender = createHero({ className: "hero hero--vem-aprender", interval: "9000" });

  document.body.appendChild(home.hero);
  document.body.appendChild(vemAprender.hero);

  loadHeroCarousel({
    document,
    window: {
      setInterval: (_handler, delay) => {
        intervals.push(delay);
        return intervals.length;
      },
      clearInterval: () => {},
    },
  });

  assert.deepEqual(intervals, [6000, 9000]);
});

test("controles manuais navegam entre slides", () => {
  const document = new FakeDocument();
  const { hero, slides, prev, next } = createHero();

  document.body.appendChild(hero);

  loadHeroCarousel({
    document,
    window: {
      setInterval: () => 1,
      clearInterval: () => {},
    },
  });

  next.dispatchEvent({ type: "click" });
  assert.equal(slides[0].classList.contains("active"), false);
  assert.equal(slides[1].classList.contains("active"), true);

  prev.dispatchEvent({ type: "click" });
  assert.equal(slides[0].classList.contains("active"), true);
  assert.equal(slides[1].classList.contains("active"), false);
});
