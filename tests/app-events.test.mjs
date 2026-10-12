import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3ioAAAAASUVORK5CYII=";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const model = readFileSync(new URL("../project-store.js", import.meta.url), "utf8");

function boot({ stored, failWrites = false } = {}) {
  const fields = new Map();
  const ids = new Map();
  const events = {};
  const values = new Map(stored ? [["ai-production-storyboard-v2", JSON.stringify(stored)]] : []);
  const readers = [];
  class Element {
    dataset = {};
    style = {};
    listeners = {};
    textContent = "";
    value = "";
    files = [];
    hidden = false;
    constructor(id) { this.id = id; }
    get innerText() { return this.textContent; }
    set innerHTML(value) {
      assert.ok(this.id === "row-one" || this.id === "row-two", "Imported text reached an HTML sink");
      for (const match of value.matchAll(/data-key="([^"]+)"/g)) addField(match[1]);
    }
    addEventListener(type, callback) { this.listeners[type] = callback; }
    removeAttribute(name) { delete this[name]; }
    matches(selector) { return selector === "[data-key]" && Boolean(this.dataset.key); }
    closest(selector) { return this.matches(selector) ? this : null; }
    click() { return this.listeners.click?.({ target: this }); }
  }
  function addField(key) {
    if (!fields.has(key)) {
      const element = new Element("field:" + key);
      element.dataset.key = key;
      fields.set(key, element);
    }
  }
  for (const match of html.matchAll(/data-key="([^"]+)"/g)) addField(match[1]);
  for (const id of ["row-one", "row-two", "save-status", "save-button", "export-button", "print-button", "import-input", "recovery-button", "clear-button"]) ids.set(id, new Element(id));
  for (let number = 1; number <= 6; number++) {
    for (const prefix of ["shot-image-", "shot-image-label-", "shot-file-"]) ids.set(prefix + number, new Element(prefix + number));
  }
  const fileInputs = Array.from({ length: 6 }, (_, i) => ids.get("shot-file-" + (i + 1)));
  const storage = {
    fail: failWrites,
    getItem: (key) => values.get(key) ?? null,
    setItem(key, value) { if (this.fail) throw Error("Quota exceeded"); values.set(key, value); },
  };
  const document = {
    getElementById: (id) => ids.get(id),
    querySelectorAll: (selector) => selector === "[data-key]" ? [...fields.values()] : fileInputs,
    addEventListener(type, callback) { events[type] = callback; },
  };
  class FileReader {
    readAsDataURL(file) {
      this.result = file.data;
      readers.push(this);
      if (!file.delay) this.onload();
    }
  }
  const context = vm.createContext({
    document, localStorage: storage, FileReader, atob, Blob,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    setTimeout() {}, console,
    window: { confirm: () => true, print() {}, addEventListener(type, callback) { events[type] = callback; } },
  });
  vm.runInContext(model, context);
  vm.runInContext(source, context);
  const importProject = async (project) => {
    const input = ids.get("import-input");
    input.files = [{ size: 10, text: async () => JSON.stringify(project) }];
    await input.listeners.change({ target: input });
  };
  return { fields, ids, events, storage, values, readers, fileInputs, importProject };
}

test("restoration and imports place markup only in text sinks", async () => {
  const malicious = '<img src=x onerror="window.attack=1">';
  const app = boot({ stored: { schemaVersion: 2, textFormat: "plain", text: { "project-title": malicious }, images: { 1: png } } });
  assert.equal(app.fields.get("project-title").textContent, malicious);
  assert.equal(app.ids.get("shot-image-1").src, png);
  await app.importProject({ schemaVersion: 2, textFormat: "plain", text: { "project-title": malicious } });
  assert.equal(app.fields.get("project-title").textContent, malicious);
  assert.equal(app.ids.get("shot-image-1").hidden, true);
});

test("v2 text-only import clears rendered images and unknown omitted text", async () => {
  const app = boot({ stored: { schemaVersion: 2, textFormat: "plain", text: { "project-title": "A", "shot-1-story": "Old" }, images: { 1: png } } });
  await app.importProject({ schemaVersion: 2, textFormat: "plain", text: { "project-title": "B" } });
  assert.equal(app.fields.get("project-title").textContent, "B");
  assert.equal(app.fields.get("shot-1-story").textContent, "");
  assert.equal(app.ids.get("shot-image-1").hidden, true);
  assert.equal(app.ids.get("shot-image-1").src, undefined);
});

test("invalid import leaves visible content and storage unchanged", async () => {
  const app = boot({ stored: { schemaVersion: 2, textFormat: "plain", text: { "project-title": "A" }, images: { 1: png } } });
  const before = app.values.get("ai-production-storyboard-v2");
  await app.importProject({ text: [], images: {} });
  assert.equal(app.fields.get("project-title").textContent, "A");
  assert.equal(app.ids.get("shot-image-1").src, png);
  assert.equal(app.values.get("ai-production-storyboard-v2"), before);
  assert.match(app.ids.get("save-status").textContent, /Import failed/);
});

test("image-save failure stays visible and unsaved work guards page exit", () => {
  const app = boot({ failWrites: true });
  const input = app.fileInputs[0];
  input.files = [{ type: "image/png", size: 100, data: png }];
  input.listeners.change();
  assert.equal(app.ids.get("shot-image-1").src, png);
  assert.match(app.ids.get("save-status").textContent, /Not saved: Quota exceeded/);
  let prevented = false;
  app.events.beforeunload({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
});

test("an upload started for the previous project cannot modify the imported project", async () => {
  const app = boot();
  const input = app.fileInputs[0];
  input.files = [{ type: "image/png", size: 100, data: png, delay: true }];
  input.listeners.change();
  await app.importProject({ schemaVersion: 2, textFormat: "plain", text: { "project-title": "B" }, images: {} });
  app.readers[0].onload();
  assert.equal(app.ids.get("shot-image-1").hidden, true);
  assert.equal(app.fields.get("project-title").textContent, "B");
});
