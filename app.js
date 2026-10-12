"use strict";
const Store = globalThis.StoryboardStore;
let projectEpoch = 0;
let dirty = false;
const imageState = Object.create(null);
let keys = [];
let defaults = {};
    function createShot(number) {
      const padded = String(number).padStart(2, "0");

      return `
        <article class="shot">
          <div class="shot-header">
            <div class="shot-number">${padded}</div>

            <div
              class="timecode"
              contenteditable="true"
              data-key="shot-${number}-timecode"
              data-placeholder="00:00–00:00"
            ></div>

            <div
              class="duration"
              contenteditable="true"
              data-key="shot-${number}-duration"
              data-placeholder="Duration: 0 sec"
            ></div>
          </div>

          <div class="image-box" id="shot-image-box-${number}">
            <div class="safe-area"></div>

            <img
              id="shot-image-${number}"
              alt="Storyboard frame ${padded}"
              hidden
            >

            <div class="image-label" id="shot-image-label-${number}">
              PLACE GENERATED KEYFRAME HERE<br>
              16:9 COMPOSITION / ACTION-SAFE AREA
            </div>

            <div class="image-controls">
              <button
                type="button"
                data-upload-shot="${number}"
              >Add Image</button>

              <button
                type="button"
                data-remove-shot="${number}"
              >Remove</button>
            </div>

            <input
              class="shot-file-input"
              id="shot-file-${number}"
              type="file"
              accept="image/png,image/jpeg,image/webp"
            >
          </div>

          <div class="shot-info">
            <div class="field">
              <span class="field-title">
                Story Beat / Performance
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-story"
                data-placeholder="Subject, action, emotion, environment and narrative purpose."
              ></div>

              <span class="field-title field-spacer">
                Audio / Dialogue Cue
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-audio"
                data-placeholder="Lyric, dialogue, sound effect or musical beat."
              ></div>
            </div>

            <div class="field">
              <span class="field-title">
                AI Generation Steps
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-generation"
                data-placeholder="1. Generate base environment
2. Add locked character references
3. Correct pose and expression
4. Add lighting and effects
5. Generate motion pass"
              ></div>

              <span class="field-title field-spacer">
                Negative / Continuity Prompt
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-negative"
                data-placeholder="Identity locks, exclusions and continuity restrictions."
              ></div>
            </div>

            <div class="field">
              <span class="field-title">
                Camera
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-camera"
                data-placeholder="Shot size, angle, lens and movement"
              ></div>

              <span class="field-title field-spacer">
                Generation Data
              </span>

              <div
                contenteditable="true"
                data-key="shot-${number}-data"
                data-placeholder="Model:
Seed:
Prompt ID:
Output:"
              ></div>
            </div>
          </div>
        </article>
      `;
    }

    function buildShots() {
      document.getElementById("row-one").innerHTML =
        createShot(1) +
        createShot(2) +
        createShot(3);

      document.getElementById("row-two").innerHTML =
        createShot(4) +
        createShot(5) +
        createShot(6);
    }

function legacyText(contents) {
  const template = document.createElement("template");
  template.innerHTML = contents; // inert fragment; never attached to the document
  template.content.querySelectorAll("script,style,iframe,object,embed,svg,math").forEach((node) => node.remove());
  template.content.querySelectorAll("br").forEach((node) => node.replaceWith(document.createTextNode("\n")));
  template.content.querySelectorAll("div,p,li").forEach((node) => node.append(document.createTextNode("\n")));
  return template.content.textContent.replace(/\n$/, "");
}

function snapshot() {
  const text = Object.create(null);
  document.querySelectorAll("[data-key]").forEach((element) => {
    text[element.dataset.key] = element.innerText ?? element.textContent;
  });
  return Store.normalize({ schemaVersion: 2, textFormat: "plain", text, images: { ...imageState } }, keys, legacyText);
}

function render(project) {
  document.querySelectorAll("[data-key]").forEach((element) => {
    element.textContent = project.text[element.dataset.key] ?? defaults[element.dataset.key];
  });
  for (const key of Object.keys(imageState)) delete imageState[key];
  for (let number = 1; number <= 6; number++) {
    const image = document.getElementById("shot-image-" + number);
    image.removeAttribute("src");
    image.hidden = true;
    document.getElementById("shot-image-label-" + number).hidden = false;
  }
  for (const [number, source] of Object.entries(project.images)) {
    imageState[number] = source;
    const image = document.getElementById("shot-image-" + number);
    image.src = source;
    image.hidden = false;
    document.getElementById("shot-image-label-" + number).hidden = true;
  }
  projectEpoch++;
}

function updateStatus(message, error = false) {
  const status = document.getElementById("save-status");
  status.textContent = message;
  status.dataset.error = String(error);
}

function saveProject(message = "Saved in this browser") {
  try {
    Store.commit(localStorage, snapshot(), undefined, keys, legacyText);
    dirty = false;
    updateStatus(message);
    return true;
  } catch (error) {
    dirty = true;
    updateStatus("Not saved: " + error.message + ". Keep this page open and export JSON.", true);
    return false;
  }
}

function replaceProject(input, message) {
  // Validate everything before writing storage or touching any visible content.
  const next = Store.normalize(input, keys, legacyText);
  Store.commit(localStorage, next, snapshot(), keys, legacyText);
  render(next);
  dirty = false;
  updateStatus(message + "; previous project is available for recovery");
}

function downloadProject() {
  try {
    const project = { ...snapshot(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const title = project.text["meta-project"] || project.text["project-title"] || "storyboard-project";
    anchor.href = url;
    anchor.download = (title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "storyboard-project") + ".json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    updateStatus(dirty ? "JSON downloaded with unsaved work. Browser save still needs attention." : "Project JSON downloaded", dirty);
  } catch (error) {
    updateStatus("Could not export: " + error.message, true);
  }
}

function bindEvents() {
  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-key]")) saveProject("Autosaved in this browser");
  });
  document.addEventListener("paste", (event) => {
    if (!event.target.closest("[data-key]")) return;
    event.preventDefault();
    insertPlainText(event.clipboardData.getData("text/plain"), event.target);
  });
  document.addEventListener("drop", (event) => {
    if (!event.target.closest("[data-key]")) return;
    event.preventDefault();
    insertPlainText(event.dataTransfer.getData("text/plain"), event.target);
  });
  document.addEventListener("click", (event) => {
    const upload = event.target.closest("[data-upload-shot]");
    const remove = event.target.closest("[data-remove-shot]");
    if (upload) document.getElementById("shot-file-" + upload.dataset.uploadShot).click();
    if (remove) {
      const number = remove.dataset.removeShot;
      delete imageState[number];
      const image = document.getElementById("shot-image-" + number);
      image.removeAttribute("src");
      image.hidden = true;
      document.getElementById("shot-image-label-" + number).hidden = false;
      saveProject("Shot " + number + " image removed and saved");
    }
  });
  document.querySelectorAll(".shot-file-input").forEach((input) => {
    input.addEventListener("change", () => {
      const file = input.files[0];
      const epoch = projectEpoch;
      if (!file) return;
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > Store.MAX_IMAGE_BYTES) {
        updateStatus("Choose a PNG, JPEG or WebP image up to 8 MiB", true);
        input.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => updateStatus("Could not read the image file", true);
      reader.onload = () => {
        if (epoch !== projectEpoch) return; // Ignore an upload started for a replaced project.
        try {
          const number = input.id.replace("shot-file-", "");
          const source = Store.validateImage(reader.result);
          imageState[number] = source;
          const image = document.getElementById("shot-image-" + number);
          image.src = source;
          image.hidden = false;
          document.getElementById("shot-image-label-" + number).hidden = true;
          saveProject("Shot " + number + " image added and saved");
        } catch (error) {
          updateStatus("Image rejected: " + error.message, true);
        }
      };
      reader.readAsDataURL(file);
      input.value = "";
    });
  });
  document.getElementById("save-button").addEventListener("click", () => saveProject());
  document.getElementById("export-button").addEventListener("click", downloadProject);
  document.getElementById("print-button").addEventListener("click", () => window.print());
  document.getElementById("import-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 70 * 1024 * 1024) throw new Error("Project file exceeds 70 MiB");
      const input = JSON.parse(await file.text());
      replaceProject(input, "Project imported and saved");
    } catch (error) {
      updateStatus("Import failed; current project kept: " + error.message, true);
    }
  });
  document.getElementById("recovery-button").addEventListener("click", () => {
    try {
      const previous = Store.recovery(localStorage, keys, legacyText);
      if (window.confirm("Replace this project with the previous saved recovery copy?")) replaceProject(previous, "Recovery restored");
    } catch (error) {
      updateStatus("Recovery failed; current project kept: " + error.message, true);
    }
  });
  document.getElementById("clear-button").addEventListener("click", () => {
    if (!window.confirm("Clear this storyboard? A recovery copy will be kept first.")) return;
    try { replaceProject({ schemaVersion: 2, textFormat: "plain", text: {}, images: {} }, "Storyboard cleared"); }
    catch (error) { updateStatus("Clear failed; current project kept: " + error.message, true); }
  });
  window.addEventListener("beforeunload", (event) => {
    if (dirty) { event.preventDefault(); event.returnValue = ""; }
  });
}

function insertPlainText(text, target) {
  const selection = window.getSelection();
  if (selection.rangeCount && target.contains(selection.anchorNode)) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    target.append(document.createTextNode(text));
  }
  target.dispatchEvent(new Event("input", { bubbles: true }));
}

buildShots();
document.querySelectorAll("[data-key]").forEach((element) => {
  keys.push(element.dataset.key);
  defaults[element.dataset.key] = element.innerText ?? element.textContent;
  element.style.whiteSpace = "pre-wrap";
});
bindEvents();
try {
  const stored = Store.read(localStorage, keys, legacyText);
  if (stored) {
    render(stored);
    saveProject("Saved project restored");
  } else {
    updateStatus("Ready; changes save in this browser");
  }
} catch (error) {
  updateStatus("Stored project could not be restored: " + error.message + ". Stored data was kept.", true);
}

