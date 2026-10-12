# AI Production Storyboard

A runnable, dependency-free six-shot storyboard for manual planning, reference images, generation instructions, audio cues, and browser printing. This is the NE-0 assembly and recovery slice, not a finished narrative engine or commercial release.

## Run

Node 22 or newer:

```bash
npm start
```

Open http://127.0.0.1:8080. No installation or build step is needed. Opening `index.html` directly also loads the classic scripts, but browser storage for `file:` URLs varies; use the local server for consistent saving.

```bash
npm run check
npm test
```

## Saving and recovery

- Text and embedded PNG/JPEG/WebP images save together in one browser snapshot.
- A failed save stays visible. Current unsaved work remains on the page and can be exported while storage is full.
- Import validates the entire file before changing the current board. Missing image entries clear the previous project's images.
- Import and Clear keep a previous-project recovery copy before replacing anything. If that recovery copy cannot be saved, replacement is refused.
- **Restore previous project** swaps the current board with that recovery copy.
- Export JSON downloads the current board, including its in-memory images. It is a private project file; browser autosave is not a cross-device backup.
- Legacy v1 text/image storage and exports are supported. Legacy rich text becomes plain text with line breaks; active content is removed using an inert fragment. Original browser keys are kept.
- New exports use schemaVersion 2 and textFormat `plain`. Imported new text renders through text content, not HTML.

Uploads accept PNG/JPEG/WebP up to 8 MiB each; project imports accept files up to 70 MiB. Browser quota can be much smaller. Text field values are strings up to 1 MiB each. Unsupported versions, unknown text keys, invalid image slots, and invalid image data are rejected.

## Production workflow

Plan the beat and performance → record reference/continuity constraints → attach manually created or generated images → record generation details → review → export JSON and print.

AI generation instructions are editable notes. The audio beat/edit map is a planning surface. This slice does not connect generation providers, produce audio synchronization, publish content, or confer approval/canon status.

## Files

| File | Purpose |
| --- | --- |
| index.html | Six-shot layout and print stylesheet |
| app.js | Editor events, safe text display, import/export, and save-status UI |
| project-store.js | Validation, legacy adaptation, single-snapshot persistence, recovery |
| scripts/serve.mjs | Loopback-only local static server |
| tests/ | Persistence, editor-event, and actual startup regressions |
| assets/ | Source asset organization and placeholders |
| docs/ | Generation workflow, prompt template, checklist, deployment, and verification |
| docs/legacy-repository-package.md | Original embedded package preserved as historical source |

The six-shot limit remains a layout/prototype constraint. Multiple projects, structured scene/panel/shot contracts, durable asset storage, studio adapters, and player runtimes belong to later slices.

## Verification and rights

See [NE-0 verification](docs/NE0-VERIFICATION.md). Node tests include editor events in a DOM surrogate; browser layout, inert legacy parsing, file dialogs, and printed output still require real-browser review.

The embedded MIT notice is preserved in LICENSE. Code licensing does not clear every external image, recording, font, reference, or generated output. Confirm rights before distributing a commercial template.
