import test from "node:test";
import assert from "node:assert/strict";
import "../project-store.js";
const S = globalThis.StoryboardStore;
const keys = ["project-title", "shot-1-story"];
const plain = (value) => value;
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j3ioAAAAASUVORK5CYII=";
const project = (title, images = {}) => ({ schemaVersion: 2, textFormat: "plain", text: { "project-title": title }, images });
class MemoryStorage {
  values = new Map();
  fail = null;
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { if (this.fail === key) throw Error("Quota exceeded"); this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test("text and exact image bytes survive save/reload/export/import", () => {
  const a = new MemoryStorage();
  S.commit(a, project("A", { 1: png }), undefined, keys, plain);
  const restored = S.read(a, keys, plain);
  const b = new MemoryStorage();
  S.commit(b, JSON.parse(JSON.stringify(restored)), undefined, keys, plain);
  assert.deepEqual(S.read(b, keys, plain), restored);
  assert.equal(restored.images[1], png);
});

test("text-only legacy replacement clears old images and retains recovery", () => {
  const storage = new MemoryStorage();
  const before = project("A", { 1: png });
  S.commit(storage, before, undefined, keys, plain);
  S.commit(storage, { text: { "project-title": "B" } }, before, keys, plain);
  assert.deepEqual(Object.keys(S.read(storage, keys, plain).images), []);
  assert.equal(S.recovery(storage, keys, plain).images[1], png);
});

test("invalid import changes neither current nor recovery storage", () => {
  for (const bad of [
    { text: [] }, { text: { "project-title": 4 } }, { text: { foreign: "x" } },
    { text: {}, images: { 9: png } }, { text: {}, images: { 1: "javascript:alert(1)" } },
    { schemaVersion: 3, text: {} }, { application: "other", text: {} },
    JSON.parse('{"text":{"__proto__":"bad"}}'),
  ]) {
    const storage = new MemoryStorage();
    S.commit(storage, project("A"), undefined, keys, plain);
    const before = [...storage.values];
    assert.throws(() => S.commit(storage, bad, project("A"), keys, plain));
    assert.deepEqual([...storage.values], before);
  }
});

test("current write failure keeps previous combined snapshot and exact recovery", () => {
  const storage = new MemoryStorage();
  const before = project("A", { 1: png });
  S.commit(storage, before, undefined, keys, plain);
  storage.fail = S.CURRENT_KEY;
  assert.throws(() => S.commit(storage, project("B"), before, keys, plain), /Quota/);
  assert.equal(S.read(storage, keys, plain).text["project-title"], "A");
  assert.equal(S.recovery(storage, keys, plain).images[1], png);
});

test("failed recovery write prevents an active-project write", () => {
  const storage = new MemoryStorage();
  S.commit(storage, project("A"), undefined, keys, plain);
  const before = storage.getItem(S.CURRENT_KEY);
  storage.fail = S.RECOVERY_KEY;
  assert.throws(() => S.commit(storage, project("B"), project("A"), keys, plain));
  assert.equal(storage.getItem(S.CURRENT_KEY), before);
});

test("legacy migration preserves original keys and converts text via inert-text adapter", () => {
  const storage = new MemoryStorage();
  storage.setItem(S.LEGACY_TEXT_KEY, JSON.stringify({ "project-title": "<b>A</b>" }));
  storage.setItem(S.LEGACY_IMAGE_KEY, JSON.stringify({ 1: png }));
  const result = S.read(storage, keys, (value) => value.replace(/<[^>]*>/g, ""));
  assert.equal(result.text["project-title"], "A");
  assert.equal(result.images[1], png);
  assert.match(storage.getItem(S.LEGACY_TEXT_KEY), /<b>/);
});

test("plain text markup remains literal, and mislabeled/active images are rejected", () => {
  const input = '<img src=x onerror="window.attack=1">';
  assert.equal(S.normalize(project(input), keys, plain).text["project-title"], input);
  assert.throws(() => S.validateImage("data:image/svg+xml;base64,PHN2Zz4="));
  assert.throws(() => S.validateImage("data:image/png;base64,AAAA"));
});
