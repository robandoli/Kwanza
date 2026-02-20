"use strict";

class FakeClassList {
  constructor(initial = "") {
    this._set = new Set(initial.split(/\s+/).filter(Boolean));
  }

  add(name) {
    this._set.add(name);
  }

  remove(name) {
    this._set.delete(name);
  }

  contains(name) {
    return this._set.has(name);
  }

  toggle(name) {
    if (this._set.has(name)) {
      this._set.delete(name);
      return false;
    }
    this._set.add(name);
    return true;
  }

  toString() {
    return Array.from(this._set).join(" ");
  }
}

class FakeElement {
  constructor(tagName, { id = "", className = "", textContent = "" } = {}) {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.classList = new FakeClassList(className);
    this.textContent = textContent;
    this.style = {};
    this.dataset = {};
    this.hidden = false;
    this.value = "";
    this.parentNode = null;
    this.children = [];
    this._listeners = new Map();
    this._attributes = new Map();
  }

  setAttribute(name, value) {
    this._attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this._attributes.get(name) || null;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  addEventListener(type, handler) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(handler);
  }

  dispatchEvent(event) {
    if (!event || !event.type) throw new Error("Event must have a type");
    if (!event.target) event.target = this;
    const handlers = this._listeners.get(event.type) || [];
    handlers.forEach((fn) => fn(event));
    return true;
  }

  focus() {
    this._focused = true;
  }

  _matchesSimple(selector) {
    if (selector.startsWith("#")) return this.id === selector.slice(1);
    if (selector.startsWith(".")) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }

  _walk(callback) {
    for (const child of this.children) {
      callback(child);
      child._walk(callback);
    }
  }

  querySelectorAll(selector) {
    const results = [];

    if (selector.includes(" ")) {
      const [parentSel, childSel] = selector.split(/\s+/, 2);
      const parents = this.querySelectorAll(parentSel);
      parents.forEach((p) => {
        p.querySelectorAll(childSel).forEach((el) => results.push(el));
      });
      return results;
    }

    this._walk((node) => {
      if (node._matchesSimple(selector)) results.push(node);
    });
    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
}

class FakeDocument {
  constructor() {
    this.body = new FakeElement("body");
    this.hidden = false;
    this._listeners = new Map();
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  addEventListener(type, handler) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(handler);
  }

  dispatchDOMContentLoaded() {
    const handlers = this._listeners.get("DOMContentLoaded") || [];
    handlers.forEach((fn) => fn({ type: "DOMContentLoaded", target: this }));
  }

  getElementById(id) {
    if (this.body.id === id) return this.body;
    return this.body.querySelector(`#${id}`);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

module.exports = {
  FakeDocument,
  FakeElement,
};

