# LabTrack execution presentation

The current deliverable is `output/LabTrack_Execution_Presentation_v2.2.pptx` (22 slides). Text and evidence tables are editable; screenshots are embedded images of the running synthetic prototype. Speaker notes contain repository and primary research references. v1 and v1.1 remain unchanged historical pitch material.

`code/build.mjs` uses the bundled `@oai/artifact-tool` runtime. Set `LABTRACK_NODE_MODULES`, `LABTRACK_PRESENTATION_SKILL` and `LABTRACK_RUNTIME_PYTHON` to the paths returned by Codex workspace dependencies and the installed presentation skill. The build reads browser evidence from `.artifacts/browser/`, copies the actual screenshots to `assets/`, renders previews, exports a private candidate, and finalizes to a new output filename. Before a rebuild, select a new final filename and receipt filename because validated artifacts are not overwritten by the finalizer.

Content is grounded in current project documents and implementation evidence. The deck explicitly identifies blocked policies and unavailable database/cloud integration checks. It has not been opened or tested in native PowerPoint during this session.

The matching `output/LabTrack_Execution_Presentation_v2.2.html` is a self-contained offline browser viewer with all22 artifact-tool slide renders and original speaker/source notes. It opens directly without a server. Use arrow keys, Home/End, N for notes and F for fullscreen. The PPTX retains editable text/tables; the HTML viewer displays embedded slide images. Reproduce with `python scripts/export_browser_presentation.py`; its source PPTX hash must match the finalization receipt. Browser validation is `scripts/browser_presentation_check.mjs`.
