/* Single-snapshot persistence. Browser and Node tests share this dependency-free code. */
(() => {
  "use strict";
  const CURRENT_KEY = "ai-production-storyboard-v2";
  const RECOVERY_KEY = "ai-production-storyboard-recovery-v2";
  const LEGACY_TEXT_KEY = "ai-production-storyboard-v1";
  const LEGACY_IMAGE_KEY = "ai-production-storyboard-images-v1";
  const APPLICATION = "AI Production Storyboard";
  const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

  function record(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(name + " must be an object");
    }
    return value;
  }

  function validateImage(source) {
    if (typeof source !== "string" || source.length > MAX_IMAGE_BYTES * 1.4) {
      throw new Error("Image is too large or is not a string");
    }
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(source);
    if (!match || match[2].length % 4 !== 0) throw new Error("Use an embedded PNG, JPEG or WebP image");
    const bytes = atob(match[2]);
    if (bytes.length > MAX_IMAGE_BYTES) throw new Error("Image exceeds 8 MiB");
    const mime = match[1];
    const valid = mime === "png"
      ? bytes.startsWith("\x89PNG\r\n\x1a\n")
      : mime === "jpeg"
        ? bytes.startsWith("\xff\xd8\xff")
        : bytes.startsWith("RIFF") && bytes.slice(8, 12) === "WEBP";
    if (!valid) throw new Error("Image data does not match its type");
    return source;
  }

  function normalize(input, keys, legacyText) {
    const value = record(input, "Project");
    const allowed = new Set(["application", "version", "exportedAt", "schemaVersion", "textFormat", "text", "images"]);
    for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error("Unknown project field: " + key);
    if (value.application !== undefined && value.application !== APPLICATION) throw new Error("Different application");
    if (value.schemaVersion !== undefined && value.schemaVersion !== 2) throw new Error("Unsupported project version");
    const legacy = value.schemaVersion === undefined;
    if (!legacy && value.textFormat !== "plain") throw new Error("Unsupported text format");
    if (legacy && value.version !== undefined && value.version !== "1.0.0") throw new Error("Unsupported legacy version");
    const text = record(value.text, "Text");
    const images = record(value.images === undefined ? {} : value.images, "Images");
    const permitted = new Set(keys);
    const normalizedText = Object.create(null);
    for (const [key, contents] of Object.entries(text)) {
      if (!permitted.has(key) || typeof contents !== "string" || contents.length > 1024 * 1024) {
        throw new Error("Invalid text field: " + key);
      }
      normalizedText[key] = legacy ? legacyText(contents) : contents;
    }
    const normalizedImages = Object.create(null);
    for (const [key, source] of Object.entries(images)) {
      if (!/^[1-6]$/.test(key)) throw new Error("Invalid image slot: " + key);
      normalizedImages[key] = validateImage(source);
    }
    return {
      application: APPLICATION,
      schemaVersion: 2,
      textFormat: "plain",
      text: normalizedText,
      images: normalizedImages,
    };
  }

  function read(storage, keys, legacyText) {
    const current = storage.getItem(CURRENT_KEY);
    if (current !== null) return normalize(JSON.parse(current), keys, legacyText);
    const oldText = storage.getItem(LEGACY_TEXT_KEY);
    const oldImages = storage.getItem(LEGACY_IMAGE_KEY);
    if (oldText === null && oldImages === null) return null;
    // Leave the original keys intact for recovery; migration occurs only after validation.
    return normalize({ text: oldText === null ? {} : JSON.parse(oldText), images: oldImages === null ? {} : JSON.parse(oldImages) }, keys, legacyText);
  }

  function commit(storage, next, previous, keys, legacyText) {
    const project = normalize(next, keys, legacyText);
    const serialized = JSON.stringify(project);
    if (previous !== undefined) {
      const recovery = normalize(previous, keys, legacyText);
      // If the recovery write fails, the active project is never touched.
      storage.setItem(RECOVERY_KEY, JSON.stringify(recovery));
    }
    // localStorage replaces this single text+image value atomically.
    storage.setItem(CURRENT_KEY, serialized);
    return project;
  }

  function recovery(storage, keys, legacyText) {
    const value = storage.getItem(RECOVERY_KEY);
    if (value === null) throw new Error("No previous project is available");
    return normalize(JSON.parse(value), keys, legacyText);
  }

  globalThis.StoryboardStore = Object.freeze({
    CURRENT_KEY, RECOVERY_KEY, LEGACY_TEXT_KEY, LEGACY_IMAGE_KEY,
    MAX_IMAGE_BYTES, normalize, validateImage, read, commit, recovery,
  });
})();
