"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { FakeDocument, FakeElement } = require("./fake-dom");

function loadBuscaScript(document) {
  const scriptPath = path.join(__dirname, "static/js/busca-musica.js");
  const code = fs.readFileSync(scriptPath, "utf8");
  const context = {
    document,
    console,
    Event: function Event(type) {
      this.type = type;
    },
  };
  vm.runInNewContext(code, context, { filename: scriptPath });
  document.dispatchDOMContentLoaded();
}

function createSongBlock(title, author, lyrics) {
  const block = new FakeElement("article", { className: "musica-bloco" });
  const header = new FakeElement("header", { className: "musica-header" });
  const h3 = new FakeElement("h3", { textContent: title });
  const authorEl = new FakeElement("p", { className: "musica-autor", textContent: author });
  const lyricEl = new FakeElement("div", { className: "musica-letra-conteudo", textContent: lyrics });

  header.appendChild(h3);
  header.appendChild(authorEl);
  block.appendChild(header);
  block.appendChild(lyricEl);
  return block;
}

function setupDOM() {
  const document = new FakeDocument();
  const input = new FakeElement("input", { id: "busca-musica" });
  input.dataset.emptyMessage = "Nenhuma música encontrada com este termo.";
  const clearButton = new FakeElement("button", { id: "limpar-busca-musica" });
  clearButton.hidden = true;
  const list = new FakeElement("div", { id: "lista-musicas" });

  list.appendChild(
    createSongBlock("Eu acredito, eu tenho fé na capoeira", "Mestre Tucano Preto", "meu passaporte é a capoeira")
  );
  list.appendChild(
    createSongBlock("Tem Jararaca", "Mestre Jaguara", "jararaca é pequena, pode morder a sua mão")
  );

  document.body.appendChild(input);
  document.body.appendChild(clearButton);
  document.body.appendChild(list);

  return { document, input, clearButton, list };
}

function visibleSongs(list) {
  return list.querySelectorAll(".musica-bloco").filter((el) => el.style.display !== "none");
}

test("filtra por título, autor e letra", () => {
  const { document, input, list } = setupDOM();
  loadBuscaScript(document);

  input.value = "jararaca";
  input.dispatchEvent({ type: "input" });
  assert.equal(visibleSongs(list).length, 1);

  input.value = "tucano";
  input.dispatchEvent({ type: "input" });
  assert.equal(visibleSongs(list).length, 1);

  input.value = "passaporte";
  input.dispatchEvent({ type: "input" });
  assert.equal(visibleSongs(list).length, 1);
});

test("mostra mensagem vazia e exibe botão de limpar", () => {
  const { document, input, clearButton, list } = setupDOM();
  loadBuscaScript(document);

  input.value = "nao-existe";
  input.dispatchEvent({ type: "input" });

  const empty = document.getElementById("mensagem-busca-vazia");
  assert.ok(empty);
  assert.equal(empty.style.display, "block");
  assert.equal(clearButton.hidden, false);
  assert.equal(visibleSongs(list).length, 0);
});

test("botão limpar restaura lista e oculta mensagem", () => {
  const { document, input, clearButton, list } = setupDOM();
  loadBuscaScript(document);

  input.value = "nao-existe";
  input.dispatchEvent({ type: "input" });
  clearButton.dispatchEvent({ type: "click" });

  const empty = document.getElementById("mensagem-busca-vazia");
  assert.equal(input.value, "");
  assert.equal(clearButton.hidden, true);
  assert.equal(empty.style.display, "none");
  assert.equal(visibleSongs(list).length, 2);
});

