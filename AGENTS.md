# AI-Storyboard contributor instructions

This repository is a static storyboard editor. The original embedded package is retained in docs/legacy-repository-package.md.

- Preserve manual editing, six-shot layout, JSON exchange, recovery, and printing.
- Imported project text must never be attached to the document as HTML. The legacy HTML-to-text adapter uses an inert fragment only.
- Validation must complete before an import changes storage or the visible project.
- Text and images persist in one snapshot. Do not silently discard images to satisfy browser quota.
- Keep failure status truthful; export unsaved work independently of storage success.
- Public fixtures and examples must be neutral and redistribution-ready. Keep private studio content and credentials out.
- Generation notes and completed uploads do not establish approval, canon, or publication.
- Run npm run check and npm test. Record browser QA limitations explicitly.
- This slice does not implement the shared narrative engine, AI jobs, studio adapters, or novel players.
