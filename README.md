STORYBOARD_REPOSITORY_PACKAGE.md
```
Each heading below represents a file to place in your GitHub repository. The resulting project is a static, Vercel-deployable storyboard application with:

- Six editable storyboard panels per page
- AI generation instructions for every shot
- Character and visual reference areas
- Audio/edit-map fields
- Local browser autosave
- Image upload and replacement
- Print/PDF export
- JSON project export/import
- No build process or external dependencies

---

## 1. Repository structure

```text
ai-production-storyboard/
├── index.html
├── README.md
├── vercel.json
├── .gitignore
├── LICENSE
│
├── assets/
│   ├── README.md
│   ├── branding/
│   │   └── .gitkeep
│   ├── characters/
│   │   └── .gitkeep
│   ├── locations/
│   │   └── .gitkeep
│   ├── motifs/
│   │   └── .gitkeep
│   └── storyboard-frames/
│       └── .gitkeep
│
└── docs/
    ├── AI-GENERATION-WORKFLOW.md
    ├── DEPLOYMENT.md
    ├── PROMPT-TEMPLATE.md
    └── PRODUCTION-CHECKLIST.md
```

---

# 2. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="description"
    content="Editable AI production storyboard for planning, generation, editing, and final production."
  >

  <title>AI Production Storyboard</title>

  <style>
    :root {
      --page-width: 1600px;
      --page-height: 900px;
      --ink: #111;
      --paper: #fff;
      --workspace: #d3d3d3;
      --line: #202020;
      --muted: #777;
      --placeholder: #aaa;
      --focus: #fff6bf;
      --accent: #9e0000;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      background: var(--workspace);
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      cursor: pointer;
    }

    /* TOOLBAR */

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      background: #151515;
      color: white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
    }

    .toolbar button,
    .toolbar label {
      min-height: 34px;
      padding: 8px 13px;
      border: 1px solid #555;
      border-radius: 4px;
      background: #292929;
      color: white;
      font-size: 13px;
    }

    .toolbar button:hover,
    .toolbar label:hover {
      background: #444;
    }

    .toolbar .danger {
      background: #720000;
    }

    .toolbar .status {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #bfe7bf;
      font-size: 12px;
    }

    #import-input {
      display: none;
    }

    /* STORYBOARD PAGE */

    .page {
      width: var(--page-width);
      height: var(--page-height);
      margin: 20px auto;
      padding: 18px 22px 16px;
      overflow: hidden;
      display: grid;
      grid-template-rows: 72px 1fr 1fr 150px;
      gap: 12px;
      background: var(--paper);
      border: 1px solid var(--line);
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
    }

    /* HEADER */

    .header {
      display: grid;
      grid-template-columns: 1fr 390px;
      align-items: end;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--line);
    }

    .project-title {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 32px;
      font-weight: bold;
    }

    .sequence-time {
      margin-top: 5px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 19px;
      letter-spacing: 2px;
    }

    .header-right {
      text-align: right;
    }

    .production-name {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 26px;
      font-weight: bold;
    }

    .template-label {
      margin-top: 5px;
      color: #555;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* EDITABLE FIELDS */

    [contenteditable="true"] {
      min-height: 1em;
      outline: none;
    }

    [contenteditable="true"]:focus {
      background: var(--focus);
      box-shadow: inset 0 0 0 1px #d1b900;
    }

    [contenteditable="true"]:empty::before {
      content: attr(data-placeholder);
      color: var(--placeholder);
      font-style: italic;
    }

    /* SHOT GRID */

    .shot-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      min-height: 0;
    }

    .shot {
      min-width: 0;
      min-height: 0;
      display: grid;
      grid-template-rows: 25px 1fr 88px;
      background: white;
      border: 1.5px solid var(--line);
    }

    .shot-header {
      display: grid;
      grid-template-columns: 44px 125px 1fr;
      align-items: center;
      border-bottom: 1px solid var(--line);
      font-size: 12px;
    }

    .shot-number {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ink);
      color: white;
      font-size: 17px;
      font-weight: bold;
    }

    .timecode {
      padding-left: 8px;
      font-weight: bold;
    }

    .duration {
      padding-right: 8px;
      color: #555;
      text-align: right;
    }

    /* IMAGE AREA */

    .image-box {
      position: relative;
      min-height: 0;
      overflow: hidden;
      background:
        linear-gradient(
          135deg,
          transparent 49.7%,
          #d5d5d5 50%,
          transparent 50.3%
        ),
        linear-gradient(
          45deg,
          transparent 49.7%,
          #d5d5d5 50%,
          transparent 50.3%
        ),
        #f7f7f7;
    }

    .image-box img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .safe-area {
      position: absolute;
      inset: 7%;
      z-index: 2;
      border: 1px dashed rgba(100, 100, 100, 0.45);
      pointer-events: none;
    }

    .image-controls {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 5;
      display: flex;
      gap: 5px;
    }

    .image-controls button {
      padding: 5px 8px;
      border: 1px solid #555;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.76);
      color: white;
      font-size: 9px;
    }

    .image-label {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #888;
      text-align: center;
      font-size: 12px;
      line-height: 1.5;
      letter-spacing: 1px;
    }

    .shot-file-input {
      display: none;
    }

    /* SHOT INFORMATION */

    .shot-info {
      min-height: 0;
      display: grid;
      grid-template-columns: 1.3fr 1.4fr 0.85fr;
      border-top: 1px solid var(--line);
    }

    .field {
      overflow: hidden;
      padding: 5px 6px;
      border-right: 1px solid var(--line);
      font-size: 9px;
      line-height: 1.25;
    }

    .field:last-child {
      border-right: 0;
    }

    .field-title {
      display: block;
      margin-bottom: 3px;
      font-size: 8px;
      font-weight: bold;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .field-spacer {
      margin-top: 5px;
    }

    /* FOOTER */

    .footer {
      display: grid;
      grid-template-columns: 1.2fr 1.1fr 1.35fr 1.35fr 0.9fr;
      gap: 8px;
    }

    .footer-box {
      min-width: 0;
      overflow: hidden;
      padding: 7px;
      border: 1px solid var(--line);
    }

    .footer-title {
      margin-bottom: 5px;
      padding-bottom: 3px;
      border-bottom: 1px solid #777;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 10px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
    }

    .footer-content {
      font-size: 8px;
      line-height: 1.35;
    }

    .footer-content div {
      margin-bottom: 3px;
    }

    .motif-grid,
    .reference-grid {
      height: 100px;
      display: grid;
      gap: 5px;
    }

    .motif-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .reference-grid {
      grid-template-columns: repeat(5, 1fr);
    }

    .mini-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      border: 1px dashed #999;
      background: #fafafa;
      color: #888;
      text-align: center;
      font-size: 7px;
    }

    .audio-track {
      position: relative;
      height: 38px;
      margin: 5px 0;
      border-top: 1px solid #777;
      border-bottom: 1px solid #777;
      background:
        repeating-linear-gradient(
          90deg,
          transparent 0,
          transparent 24px,
          #ddd 25px
        );
    }

    .audio-track::after {
      content: "AUDIO WAVEFORM / BEAT MAP";
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 8px;
      letter-spacing: 1px;
    }

    .metadata {
      display: grid;
      grid-template-columns: 65px 1fr;
      font-size: 8px;
      line-height: 1.25;
    }

    .metadata div {
      min-height: 16px;
      padding: 2px;
      border-bottom: 1px solid #ccc;
    }

    .meta-label {
      font-weight: bold;
    }

    .direction-only {
      margin-top: 5px;
      color: var(--accent);
      font-family: Georgia, "Times New Roman", serif;
      font-size: 11px;
      text-align: center;
    }

    /* RESPONSIVE PREVIEW */

    @media screen and (max-width: 1650px) {
      .page {
        transform: scale(0.82);
        transform-origin: top center;
        margin-bottom: -140px;
      }
    }

    @media screen and (max-width: 1350px) {
      .page {
        transform: scale(0.68);
        margin-bottom: -270px;
      }
    }

    @media screen and (max-width: 1050px) {
      .page {
        transform: scale(0.55);
        margin-bottom: -390px;
      }
    }

    /* PRINT */

    @media print {
      body {
        background: white;
      }

      .toolbar,
      .image-controls,
      .safe-area {
        display: none !important;
      }

      .page {
        width: 100%;
        height: 100vh;
        margin: 0;
        border: 0;
        box-shadow: none;
        transform: none;
        page-break-after: always;
      }

      [contenteditable="true"]:empty::before {
        content: "";
      }
    }

    @page {
      size: landscape;
      margin: 0;
    }
  </style>
</head>

<body>

  <nav class="toolbar" aria-label="Storyboard controls">
    <button type="button" id="save-button">Save</button>
    <button type="button" id="export-button">Export JSON</button>

    <label for="import-input">
      Import JSON
    </label>

    <input
      id="import-input"
      type="file"
      accept=".json,application/json"
    >

    <button type="button" id="print-button">
      Print / Export PDF
    </button>

    <button type="button" id="clear-button" class="danger">
      Clear Storyboard
    </button>

    <div class="status" id="save-status">
      Local autosave enabled
    </div>
  </nav>

  <main class="page" id="storyboard-page">

    <header class="header">
      <div>
        <div
          class="project-title editable"
          contenteditable="true"
          data-key="project-title"
          data-placeholder="[PROJECT TITLE] — Storyboard Page 1"
        ></div>

        <div
          class="sequence-time editable"
          contenteditable="true"
          data-key="sequence-time"
          data-placeholder="00:00–00:00"
        ></div>
      </div>

      <div class="header-right">
        <div
          class="production-name editable"
          contenteditable="true"
          data-key="production-name"
          data-placeholder="[PRODUCTION / STUDIO / BRAND]"
        ></div>

        <div class="template-label">
          AI Generation & Production Storyboard
        </div>
      </div>
    </header>

    <section
      class="shot-row"
      id="row-one"
      aria-label="Storyboard shots one through three"
    ></section>

    <section
      class="shot-row"
      id="row-two"
      aria-label="Storyboard shots four through six"
    ></section>

    <footer class="footer">

      <section class="footer-box">
        <div class="footer-title">
          Global Production Direction
        </div>

        <div class="footer-content">
          <div>
            <strong>Tone:</strong>
            <span
              contenteditable="true"
              data-key="global-tone"
              data-placeholder="[Mood and emotional direction]"
            ></span>
          </div>

          <div>
            <strong>Visual style:</strong>
            <span
              contenteditable="true"
              data-key="global-style"
              data-placeholder="[Medium and rendering direction]"
            ></span>
          </div>

          <div>
            <strong>Color progression:</strong>
            <span
              contenteditable="true"
              data-key="global-color"
              data-placeholder="[Starting palette → ending palette]"
            ></span>
          </div>

          <div>
            <strong>Lighting:</strong>
            <span
              contenteditable="true"
              data-key="global-lighting"
              data-placeholder="[Key light, contrast and atmosphere]"
            ></span>
          </div>

          <div>
            <strong>Continuity rules:</strong>
            <span
              contenteditable="true"
              data-key="global-continuity"
              data-placeholder="[Elements that must remain unchanged]"
            ></span>
          </div>

          <div>
            <strong>Do not include:</strong>
            <span
              contenteditable="true"
              data-key="global-negative"
              data-placeholder="[Global negative prompt]"
            ></span>
          </div>
        </div>
      </section>

      <section class="footer-box">
        <div class="footer-title">
          Visual / Motif Key
        </div>

        <div class="motif-grid">
          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="motif-1"
          >MOTIF 01<br>IMAGE / SYMBOL</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="motif-2"
          >MOTIF 02<br>IMAGE / SYMBOL</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="motif-3"
          >MOTIF 03<br>COLOR / FX</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="motif-4"
          >MOTIF 04<br>TRANSITION</div>
        </div>
      </section>

      <section class="footer-box">
        <div class="footer-title">
          Audio / Edit Map
        </div>

        <div class="audio-track"></div>

        <div class="footer-content">
          <div>
            <strong>Music section:</strong>
            <span
              contenteditable="true"
              data-key="audio-section"
              data-placeholder="[Intro / verse / chorus / score cue]"
            ></span>
          </div>

          <div>
            <strong>Beat markers:</strong>
            <span
              contenteditable="true"
              data-key="audio-beats"
              data-placeholder="[Cut and impact timecodes]"
            ></span>
          </div>

          <div>
            <strong>Dialogue / lyric cues:</strong>
            <span
              contenteditable="true"
              data-key="audio-dialogue"
              data-placeholder="[Dialogue, lyrics or vocal cues]"
            ></span>
          </div>

          <div>
            <strong>Edit rhythm:</strong>
            <span
              contenteditable="true"
              data-key="audio-rhythm"
              data-placeholder="[Slow, accelerating, montage or hold]"
            ></span>
          </div>
        </div>
      </section>

      <section class="footer-box">
        <div class="footer-title">
          Reference Assets
        </div>

        <div class="reference-grid">
          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="reference-1"
          >CHARACTER<br>REF 01</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="reference-2"
          >CHARACTER<br>REF 02</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="reference-3"
          >LOCATION<br>REF</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="reference-4"
          >PROP / WARDROBE<br>REF</div>

          <div
            class="mini-placeholder"
            contenteditable="true"
            data-key="reference-5"
          >STYLE / LIGHTING<br>REF</div>
        </div>
      </section>

      <section class="footer-box">
        <div class="footer-title">
          Project Information
        </div>

        <div class="metadata">
          <div class="meta-label">Project:</div>
          <div contenteditable="true" data-key="meta-project"></div>

          <div class="meta-label">Sequence:</div>
          <div contenteditable="true" data-key="meta-sequence"></div>

          <div class="meta-label">Length:</div>
          <div contenteditable="true" data-key="meta-length"></div>

          <div class="meta-label">Format:</div>
          <div contenteditable="true" data-key="meta-format">16:9</div>

          <div class="meta-label">Resolution:</div>
          <div contenteditable="true" data-key="meta-resolution">
            3840 × 2160
          </div>

          <div class="meta-label">FPS:</div>
          <div contenteditable="true" data-key="meta-fps">24</div>

          <div class="meta-label">Page:</div>
          <div contenteditable="true" data-key="meta-page">1</div>

          <div class="meta-label">Version:</div>
          <div contenteditable="true" data-key="meta-version">V01</div>
        </div>

        <div class="direction-only">
          For Direction Use Only
        </div>
      </section>

    </footer>
  </main>

  <script>
    const STORAGE_KEY = "ai-production-storyboard-v1";
    const IMAGE_STORAGE_KEY = "ai-production-storyboard-images-v1";

    const state = {};
    const imageState = {};

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

    function collectTextState() {
      document.querySelectorAll("[data-key]").forEach((element) => {
        state[element.dataset.key] = element.innerHTML;
      });

      return state;
    }

    function saveTextState(showMessage = true) {
      collectTextState();

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      if (showMessage) {
        updateStatus("Storyboard saved locally");
      }
    }

    function restoreTextState() {
      const savedState = localStorage.getItem(STORAGE_KEY);

      if (!savedState) {
        return;
      }

      try {
        const parsedState = JSON.parse(savedState);

        document.querySelectorAll("[data-key]").forEach((element) => {
          const key = element.dataset.key;

          if (Object.prototype.hasOwnProperty.call(parsedState, key)) {
            element.innerHTML = parsedState[key];
          }
        });
      } catch (error) {
        console.error("Could not restore storyboard:", error);
      }
    }

    function saveImages() {
      try {
        localStorage.setItem(
          IMAGE_STORAGE_KEY,
          JSON.stringify(imageState)
        );
      } catch (error) {
        updateStatus(
          "Image too large for local storage; export JSON or keep source files"
        );
      }
    }

    function restoreImages() {
      const savedImages = localStorage.getItem(IMAGE_STORAGE_KEY);

      if (!savedImages) {
        return;
      }

      try {
        Object.assign(imageState, JSON.parse(savedImages));

        Object.entries(imageState).forEach(([shotNumber, source]) => {
          displayShotImage(shotNumber, source);
        });
      } catch (error) {
        console.error("Could not restore images:", error);
      }
    }

    function displayShotImage(shotNumber, source) {
      const image = document.getElementById(
        `shot-image-${shotNumber}`
      );

      const label = document.getElementById(
        `shot-image-label-${shotNumber}`
      );

      if (!image || !label) {
        return;
      }

      image.src = source;
      image.hidden = false;
      label.hidden = true;
    }

    function removeShotImage(shotNumber) {
      const image = document.getElementById(
        `shot-image-${shotNumber}`
      );

      const label = document.getElementById(
        `shot-image-label-${shotNumber}`
      );

      if (!image || !label) {
        return;
      }

      image.removeAttribute("src");
      image.hidden = true;
      label.hidden = false;

      delete imageState[shotNumber];
      saveImages();

      updateStatus(`Shot ${shotNumber} image removed`);
    }

    function handleImageUpload(shotNumber, file) {
      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const source = event.target.result;

        imageState[shotNumber] = source;
        displayShotImage(shotNumber, source);
        saveImages();

        updateStatus(`Shot ${shotNumber} image added`);
      };

      reader.readAsDataURL(file);
    }

    function updateStatus(message) {
      const status = document.getElementById("save-status");
      status.textContent = message;

      window.clearTimeout(updateStatus.timeout);

      updateStatus.timeout = window.setTimeout(() => {
        status.textContent = "Local autosave enabled";
      }, 2500);
    }

    function exportProject() {
      const projectData = {
        application: "AI Production Storyboard",
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        text: collectTextState(),
        images: imageState
      };

      const data = JSON.stringify(projectData, null, 2);
      const blob = new Blob([data], {
        type: "application/json"
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      const projectName =
        state["meta-project"] ||
        state["project-title"] ||
        "storyboard-project";

      const cleanName = projectName
        .replace(/<[^>]*>/g, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      anchor.href = url;
      anchor.download = `${cleanName || "storyboard-project"}.json`;
      anchor.click();

      URL.revokeObjectURL(url);
      updateStatus("Project JSON exported");
    }

    function importProject(file) {
      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);

          if (imported.text) {
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(imported.text)
            );
          }

          if (imported.images) {
            localStorage.setItem(
              IMAGE_STORAGE_KEY,
              JSON.stringify(imported.images)
            );
          }

          window.location.reload();
        } catch (error) {
          alert("The selected file is not a valid storyboard JSON file.");
        }
      };

      reader.readAsText(file);
    }

    function clearStoryboard() {
      const confirmed = window.confirm(
        "Clear all storyboard text and locally stored images?"
      );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(IMAGE_STORAGE_KEY);
      window.location.reload();
    }

    function bindEvents() {
      document.addEventListener("input", (event) => {
        if (event.target.matches("[data-key]")) {
          saveTextState(false);
          updateStatus("Autosaved");
        }
      });

      document.addEventListener("click", (event) => {
        const uploadButton = event.target.closest(
          "[data-upload-shot]"
        );

        const removeButton = event.target.closest(
          "[data-remove-shot]"
        );

        if (uploadButton) {
          const shotNumber = uploadButton.dataset.uploadShot;
          document.getElementById(`shot-file-${shotNumber}`).click();
        }

        if (removeButton) {
          removeShotImage(removeButton.dataset.removeShot);
        }
      });

      document.querySelectorAll(".shot-file-input").forEach((input) => {
        input.addEventListener("change", () => {
          const shotNumber = input.id.replace("shot-file-", "");
          handleImageUpload(shotNumber, input.files[0]);
          input.value = "";
        });
      });

      document.getElementById("save-button").addEventListener(
        "click",
        () => saveTextState(true)
      );

      document.getElementById("export-button").addEventListener(
        "click",
        exportProject
      );

      document.getElementById("import-input").addEventListener(
        "change",
        (event) => {
          importProject(event.target.files[0]);
        }
      );

      document.getElementById("print-button").addEventListener(
        "click",
        () => window.print()
      );

      document.getElementById("clear-button").addEventListener(
        "click",
        clearStoryboard
      );

      window.addEventListener("beforeunload", () => {
        saveTextState(false);
      });
    }

    function initializeApplication() {
      buildShots();
      restoreTextState();
      restoreImages();
      bindEvents();
    }

    initializeApplication();
  </script>
</body>
</html>
```

---

# 3. `README.md`

````markdown
# AI Production Storyboard

A browser-based storyboard template for planning AI-assisted image and video generation.

The application is designed to turn narrative ideas into structured, editable shot instructions that can be generated, reviewed, animated, edited, and prepared for final production.

## Features

- Six storyboard shots per page
- Editable project and sequence information
- Editable shot timecodes and durations
- Story beat and performance direction
- Audio, dialogue, lyric, and music cues
- Camera, lens, framing, and movement direction
- Step-by-step AI generation instructions
- Negative prompts and continuity restrictions
- Model, seed, prompt ID, and output tracking
- Generated image placement
- Browser-based local autosave
- JSON project import and export
- Landscape PDF and print output
- Static Vercel deployment
- No package installation required
- No external JavaScript libraries

## Repository structure

```text
ai-production-storyboard/
├── index.html
├── README.md
├── vercel.json
├── .gitignore
├── LICENSE
├── assets/
└── docs/
```

## Run locally

No build process is required.

### Basic method

Open `index.html` directly in a web browser.

### Recommended local server

If Python is installed:

```bash
python -m http.server 3000
```

Then open:

```text
http://localhost:3000
```

You can also use the VS Code Live Server extension.

## Deploy to Vercel

1. Upload this repository to GitHub.
2. Sign in to Vercel.
3. Create a new project.
4. Import the GitHub repository.
5. Select `Other` as the framework preset if prompted.
6. Leave the build command empty.
7. Leave the output directory blank or set it to `.`.
8. Deploy.

The repository contains a `vercel.json` configuration for static delivery.

## Saving a storyboard

Text and uploaded images are saved in the browser's local storage.

Use **Export JSON** to create a portable project backup.

Important:

- Local storage belongs to the current browser and device.
- Clearing browser data may delete locally saved work.
- Large images may exceed browser storage limits.
- Keep original images in the repository or production asset storage.
- Export the storyboard JSON regularly.

## Importing a storyboard

1. Select **Import JSON**.
2. Choose a previously exported storyboard file.
3. The application reloads with the imported project.

Importing replaces the current locally saved storyboard.

## Exporting a PDF

1. Select **Print / Export PDF**.
2. Choose landscape orientation if it is not selected automatically.
3. Choose `Save as PDF`.
4. Disable browser headers and footers.
5. Set margins to `None` or `Minimum`.
6. Enable background graphics.

## Suggested production workflow

1. Complete project metadata.
2. Add reference assets.
3. Define global continuity rules.
4. Plan shot timecodes.
5. Write each story beat.
6. define the camera direction.
7. Create the base environment.
8. Add character references.
9. Correct performance and interaction.
10. Add lighting, atmosphere, and effects.
11. Generate motion.
12. Export approved frames or clips.
13. Record the model, seed, and prompt version.
14. Assemble the results in an editing application.
15. Export a storyboard PDF and JSON archive.

## Suggested filename format

```text
PROJECT_SEQUENCE_SCENE_SHOT_PASS_VERSION_RESOLUTION.ext
```

Example:

```text
PROJECT_OP_SC01_SH03_MOTION_V04_4K.mp4
```

## Limitations

This version is a static client-side application.

It does not include:

- User accounts
- Online collaboration
- Server-side image storage
- Cloud database storage
- Built-in AI generation
- Automatic version history
- Role-based access
- Production approval workflows

These features can be added later using a full-stack framework and database.

## License

MIT License. See `LICENSE`.
````

---

# 4. `vercel.json`

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

# 5. `.gitignore`

```gitignore
# Operating-system files
.DS_Store
Thumbs.db
Desktop.ini

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Temporary exports
exports/
temp/
tmp/

# Optional generated media
*.mov
*.mp4
*.mkv
*.avi
*.webm

# Keep production source media outside Git unless intentionally added
```

---

# 6. `LICENSE`

```text
MIT License

Copyright (c) 2026 Storyboard Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING
FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

---

# 7. `assets/README.md`

```markdown
# Storyboard Assets

This directory stores visual assets used during storyboard development.

## Directory structure

```text
assets/
├── branding/
├── characters/
├── locations/
├── motifs/
└── storyboard-frames/
```

## Branding

Use `assets/branding/` for:

- Project logos
- Studio logos
- Title treatments
- Watermarks
- Production identity elements

## Characters

Use `assets/characters/` for:

- Character turnarounds
- Face references
- Expression sheets
- Costume references
- Pose references
- Character color palettes

Suggested naming:

```text
CHARACTER-NAME_reference_front_v01.png
CHARACTER-NAME_reference_profile_v01.png
CHARACTER-NAME_expression-sheet_v01.png
CHARACTER-NAME_costume_v01.png
```

## Locations

Use `assets/locations/` for:

- Environment references
- Location concepts
- Establishing shots
- Architecture references
- Lighting references
- Environment color palettes

Suggested naming:

```text
LOCATION-NAME_establishing_v01.png
LOCATION-NAME_lighting-night_v01.png
LOCATION-NAME_palette_v01.png
```

## Motifs

Use `assets/motifs/` for:

- Symbols
- Graphic elements
- Magical effects
- Transition references
- Repeating visual themes
- Color and texture keys

## Storyboard frames

Use `assets/storyboard-frames/` for approved keyframes.

Suggested naming:

```text
PROJECT_SEQUENCE_SCENE_SHOT_KEYFRAME_VERSION.png
```

Example:

```text
PROJECT_OP_SC01_SH03_KEYFRAME_V04.png
```

## Recommended formats

- PNG for transparency and graphics
- JPEG for lightweight visual references
- WebP for optimized web display
- SVG for logos, symbols, and line graphics

Avoid committing large production video files directly to the repository unless Git Large File Storage is configured.
```

---

# 8. `docs/AI-GENERATION-WORKFLOW.md`

```markdown
# AI Generation Workflow

This workflow turns each storyboard panel into a controlled generation sequence.

## Stage 1: Define the shot

Before generating anything, define:

- Narrative purpose
- Subject
- Environment
- Time of day
- Character emotion
- Character action
- Beginning pose
- Ending pose
- Camera position
- Camera movement
- Audio cue
- Shot duration
- Transition into the shot
- Transition out of the shot

## Stage 2: Lock references

Collect and approve:

- Character face references
- Character body proportions
- Hairstyle
- Costume
- Props
- Location
- Architecture
- Color palette
- Lighting style
- Visual motifs
- Rendering style

Every recurring character should have an identity lock.

An identity lock should describe details that cannot change between shots.

Example:

```text
Maintain the same face shape, eye color, hairstyle, costume, accessories,
body proportions, apparent age, and color palette in every shot.
```

## Stage 3: Generate the environment plate

Generate the environment without characters.

Focus on:

- Composition
- Perspective
- Horizon position
- Foreground elements
- Middle-ground elements
- Background elements
- Light direction
- Atmospheric depth
- Empty areas reserved for characters
- Camera height
- Lens impression

Do not add effects that obstruct the future character placement.

## Stage 4: Add characters

Add one character at a time when the generation system allows it.

For each character, define:

- Name
- Screen position
- Distance from camera
- Body orientation
- Face direction
- Eye line
- Pose
- Expression
- Hand position
- Interaction with objects
- Interaction with other characters

## Stage 5: Performance correction

Review:

- Facial expression
- Eye direction
- Hand anatomy
- Foot placement
- Weight distribution
- Character interaction
- Emotional readability
- Costume continuity
- Prop continuity
- Screen direction

Regenerate or correct the shot before adding complex effects.

## Stage 6: Cinematic pass

Define:

- Shot size
- Camera angle
- Lens
- Depth of field
- Focus target
- Camera movement
- Motion speed
- Camera shake
- Foreground occlusion
- Composition balance

Example:

```text
Medium close shot, eye-level camera, restrained 50mm lens impression,
shallow depth of field, focus locked on the lead character's eyes,
slow six-second push forward.
```

## Stage 7: Lighting and effects

Add:

- Key light
- Fill light
- Rim light
- Volumetric light
- Weather
- Fog
- Dust
- Particles
- Energy effects
- Reflections
- Motion streaks
- Environmental response

Effects should support the story beat rather than obscure the performance.

## Stage 8: Motion generation

Separate subject motion from camera movement.

### Subject motion

Describe:

- Initial pose
- Action
- Speed
- Direction
- Final pose
- Secondary motion
- Cloth movement
- Hair movement
- Environmental reaction

### Camera movement

Describe:

- Static, pan, tilt, dolly, track, crane, orbit, zoom, or handheld
- Direction
- Speed
- Duration
- Start framing
- End framing
- Focus behavior

### Locked elements

State what must remain unchanged:

- Character identity
- Costume
- Location geometry
- Light direction
- Prop position
- Background architecture
- Number of characters
- Screen direction

## Stage 9: Quality control

Inspect each result for:

- Identity drift
- Costume drift
- Incorrect character count
- Duplicate limbs
- Hand artifacts
- Eye artifacts
- Object warping
- Background mutation
- Flickering
- Lighting inconsistency
- Unwanted camera movement
- Unwanted text
- Watermarks
- Logo distortion

## Stage 10: Production output

Prepare:

- Clean keyframe
- Start frame
- End frame
- Motion clip
- Transparent effects pass when available
- Clean environment plate
- Character-only pass when available
- High-resolution still
- Proxy video
- Production video
- Prompt archive
- Seed archive
- Model/version record

## Stage 11: Editing

In the editing application:

1. Import all approved clips.
2. Place clips at storyboard timecodes.
3. Trim to musical or dialogue cues.
4. Add transitions.
5. Match color between clips.
6. Stabilize inconsistent motion.
7. Add sound design.
8. Add dialogue and music.
9. Add titles and graphics.
10. Review continuity.
11. Export a review version.
12. Apply notes.
13. Export the final master.
```

---

# 9. `docs/PROMPT-TEMPLATE.md`

````markdown
# AI Shot Prompt Template

Use this template for each storyboard shot.

## Shot identification

```text
PROJECT:
SEQUENCE:
SCENE:
SHOT:
VERSION:
DURATION:
ASPECT RATIO:
RESOLUTION:
FRAME RATE:
```

## Narrative purpose

```text
The purpose of this shot is:
```

## Subject

```text
Primary subject:
Secondary subjects:
Character count:
Character identity references:
Wardrobe:
Props:
```

## Action

```text
Starting action:
Primary action:
Ending action:
Character interaction:
Environmental reaction:
```

## Performance

```text
Emotion:
Facial expression:
Eye line:
Body language:
Energy level:
Performance restrictions:
```

## Environment

```text
Location:
Time of day:
Weather:
Foreground:
Middle ground:
Background:
Architecture:
Atmosphere:
```

## Composition

```text
Shot size:
Camera angle:
Camera height:
Subject placement:
Horizon:
Leading lines:
Foreground framing:
Negative space:
Depth layers:
```

## Camera

```text
Lens impression:
Camera movement:
Movement direction:
Movement speed:
Focus target:
Depth of field:
Start framing:
End framing:
Camera restrictions:
```

## Lighting

```text
Key light:
Fill light:
Rim light:
Light direction:
Contrast:
Color temperature:
Practical lights:
Volumetric lighting:
```

## Color

```text
Primary colors:
Secondary colors:
Accent colors:
Saturation:
Contrast:
Color progression:
```

## Visual style

```text
Medium:
Rendering style:
Surface detail:
Line quality:
Texture:
Motion style:
Reference priority:
```

## Effects

```text
Particles:
Weather effects:
Energy or magical effects:
Motion effects:
Environmental effects:
Effect restrictions:
```

## Continuity locks

```text
Keep unchanged:
- Character identity
- Apparent age
- Face shape
- Eye color
- Hairstyle
- Costume
- Accessories
- Body proportions
- Props
- Environment geometry
- Light direction
- Character count
- Screen direction
```

## Negative prompt

```text
Do not include identity drift, costume changes, extra characters,
duplicate characters, extra limbs, malformed hands, distorted faces,
incorrect eye direction, floating objects, warped architecture,
unreadable text, watermarks, logos, random camera movement,
background mutation, flicker, or inconsistent lighting.
```

## Motion prompt

```text
Over [DURATION], the subject begins by [STARTING ACTION].

The subject then [PRIMARY ACTION] at [SPEED] while moving
[DIRECTION].

Secondary motion includes [HAIR, CLOTH, PARTICLES, OR ENVIRONMENT].

The camera performs [CAMERA MOVEMENT] from [START FRAMING]
to [END FRAMING].

Keep [LOCKED ELEMENTS] stationary and consistent.

The shot ends with [ENDING POSE OR COMPOSITION].
```

## Generation log

```text
MODEL:
MODEL VERSION:
SEED:
REFERENCE IMAGES:
CONTROL METHOD:
PROMPT VERSION:
GENERATION DATE:
OUTPUT FILE:
REVIEW STATUS:
NOTES:
```

## Suggested generation passes

```text
PASS 01 — Environment
PASS 02 — Character placement
PASS 03 — Pose and performance
PASS 04 — Lighting
PASS 05 — Effects
PASS 06 — Motion
PASS 07 — Correction
PASS 08 — Upscale
PASS 09 — Color match
PASS 10 — Final export
```
````

---

# 10. `docs/PRODUCTION-CHECKLIST.md`

```markdown
# Production Checklist

## Project preparation

- [ ] Project title is defined
- [ ] Sequence title is defined
- [ ] Final aspect ratio is defined
- [ ] Final resolution is defined
- [ ] Frame rate is defined
- [ ] Sequence duration is defined
- [ ] Audio track is available
- [ ] Audio timecode begins at the expected position
- [ ] Delivery format is defined

## Reference preparation

- [ ] Character reference sheets are approved
- [ ] Costume references are approved
- [ ] Location references are approved
- [ ] Prop references are approved
- [ ] Lighting references are approved
- [ ] Color palette is approved
- [ ] Visual motif references are approved
- [ ] Logo and branding files are approved

## Storyboard preparation

- [ ] Every shot has a number
- [ ] Every shot has a start time
- [ ] Every shot has an end time
- [ ] Every shot has a duration
- [ ] Every shot has a story purpose
- [ ] Every shot has a camera direction
- [ ] Every shot has an audio cue
- [ ] Every shot has an AI generation plan
- [ ] Every shot has continuity rules
- [ ] Every shot has a negative prompt

## Generation

- [ ] Environment plate generated
- [ ] Character identities locked
- [ ] Character placement approved
- [ ] Character poses approved
- [ ] Facial expressions approved
- [ ] Eye lines approved
- [ ] Hand positions approved
- [ ] Costume continuity approved
- [ ] Prop continuity approved
- [ ] Lighting approved
- [ ] Effects approved
- [ ] Camera movement approved
- [ ] Motion approved

## Quality control

- [ ] No duplicate characters
- [ ] No unwanted characters
- [ ] No extra limbs
- [ ] No malformed hands
- [ ] No distorted faces
- [ ] No identity drift
- [ ] No costume drift
- [ ] No background mutation
- [ ] No unwanted text
- [ ] No watermarks
- [ ] No unintended logos
- [ ] No visible flicker
- [ ] No frame interpolation artifacts
- [ ] No unplanned camera movement
- [ ] Color matches adjacent shots

## Editing

- [ ] Clips are organized by sequence and shot
- [ ] Clips are placed at correct timecodes
- [ ] Music cues align
- [ ] Dialogue cues align
- [ ] Transitions are approved
- [ ] Motion is consistent
- [ ] Color correction is complete
- [ ] Sound design is complete
- [ ] Titles are complete
- [ ] Credits are complete
- [ ] Review export is approved

## Archiving

- [ ] Storyboard JSON exported
- [ ] Storyboard PDF exported
- [ ] Prompts archived
- [ ] Seeds archived
- [ ] Model versions recorded
- [ ] Reference images archived
- [ ] Source generations archived
- [ ] Final clips archived
- [ ] Project files archived
- [ ] Final master archived
```

---

# 11. `docs/DEPLOYMENT.md`

````markdown
# Deployment Guide

## GitHub setup

### Create a repository

Create a new GitHub repository named:

```text
ai-production-storyboard
```

Do not initialize it with files if you already created the repository locally.

### Upload through the GitHub website

1. Open the repository.
2. Select **Add file**.
3. Select **Upload files**.
4. Upload the project files and folders.
5. Add a commit message.
6. Commit the files to the main branch.

### Upload with Git

From the project directory:

```bash
git init
git add .
git commit -m "Initial AI storyboard application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the repository address.

## Vercel deployment

1. Sign in to Vercel.
2. Select **Add New Project**.
3. Import the GitHub repository.
4. Select `Other` for the framework preset if required.
5. Leave the build command empty.
6. Leave the installation command empty.
7. Use `.` as the output directory if an output directory is required.
8. Select **Deploy**.

## Updating the application

After changing files:

```bash
git add .
git commit -m "Update storyboard application"
git push
```

The connected Vercel project will create a new deployment from the updated repository.

## Custom domain

A custom domain can be assigned from the Vercel project settings.

Suggested subdomains:

```text
storyboard.example.com
production.example.com
boards.example.com
```

## Static application limitations

The deployed site does not automatically synchronize project data between users.

Data is stored locally in each user's browser.

For collaboration, add:

- Authentication
- Cloud database
- Object storage
- Project ownership
- User permissions
- Server-side autosave
- Version history
- Comment and approval tools

## Recommended backup process

At the end of every work session:

1. Select **Save**.
2. Select **Export JSON**.
3. Save a PDF.
4. Copy approved frames into `assets/storyboard-frames/`.
5. Commit approved repository assets.
6. Keep large production media in dedicated cloud storage.
````

---

# 12. Empty directory placeholder files

Git does not track empty directories. Add a `.gitkeep` file to each empty asset directory.

## `assets/branding/.gitkeep`

```text

```

## `assets/characters/.gitkeep`

```text

```

## `assets/locations/.gitkeep`

```text

```

## `assets/motifs/.gitkeep`

```text

```

## `assets/storyboard-frames/.gitkeep`

```text

```

---

# Upload procedure

## Directly through GitHub

1. Create a folder named:

   ```text
   ai-production-storyboard
   ```

2. Recreate the file structure shown above.

3. Copy each code block into its corresponding file.

4. Create a new GitHub repository.

5. Upload the complete `ai-production-storyboard` folder contents.

6. Connect the repository to Vercel.

## Through Git on a computer

```bash
cd ai-production-storyboard

git init
git add .
git commit -m "Create AI production storyboard template"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Final Vercel configuration

Use:

```text
Framework preset: Other
Build command: Leave empty
Install command: Leave empty
Output directory: .
Root directory: .
```

The application entry point is:

```text
index.html
```

Once deployed, changes pushed to the GitHub repository can be used to create updated Vercel deployments.
