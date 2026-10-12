# NE-0 assembly and recovery

Baseline: main at 50591659d2c07b210a91400dfe192fc6b89efad2.

The application, support documentation, license, and placeholder asset tree have been extracted from the embedded repository package. Editor logic and persistence are separate classic scripts; the application needs no external runtime dependency.

Implemented:

- Closed project validation, plain-text display, PNG/JPEG/WebP validation.
- One atomic text/image browser snapshot.
- Legacy import/storage adaptation without overwriting original keys.
- Text-only replacement clears unrelated images and omitted text.
- Recovery copy before import/clear; refused replacement if recovery cannot be written.
- Persistent save failure and unsaved-work exit guard.
- Asynchronous upload guard when a project is replaced.
- Dependency-free local startup and CI commands.

Executed on Node 24.19.0:

- npm run check: passed.
- npm test: 13 passed, including an actual child-server HTTP startup test.
- Editor tests execute production event code against a DOM surrogate; they are not rendered-browser or exploit-execution evidence.

Real-browser layout, legacy inert-fragment conversion, file dialogs, keyboard/focus behavior, and PDF printing remain unverified. The available browser download failed to produce a valid executable archive. No deployment, AI generation, audio synchronization, or production release is claimed.

Storage capacity remains browser-limited. An image-save failure keeps the image in memory for JSON export. The recovery copy itself consumes quota; an import/clear is refused when it cannot be safely retained.

## NE-1 contract proposal

Next define versioned project, narrative source, scene/beat, dialogue, panel, shot, cue, asset, adaptation, and revision records. Keep unknown legacy fields in explicit migration records or reject unsupported imports without changing existing work. Use stable IDs independently of order and textual timing, and distinguish authored/estimated/verified timings.

Prove isolated projects and complete asset round trips before extracting common editor/runtime interfaces. Contract versions and review/publication state require explicit treatment. The current six-shot field-key model is a legacy input, not that future schema.
