# LabTrack CCE presentation

Vite browser presentation for a 12–15 minute faculty session. It has 15 main slides, including a five-minute live demonstration and two literature-review slides, followed by two reference slides. Earlier presentation versions remain separate.

## Run

From this directory, run `npm install` if Vite is not already available through the root project, then `npm run dev`. Open http://127.0.0.1:5174. Build with `npm run build`; serve the production build with `npm run preview` at http://127.0.0.1:4174.

Controls: arrow keys / Page Up / Page Down / Space, Home / End, N for presenter notes, O for slide overview, F for fullscreen. Escape closes overlays. Notes are visible in the same window: open them during rehearsal, not while projecting. The timer starts only when clicked and keeps running during the live demo. Browser print produces all slides in landscape.

Slide 11 opens the website and API documentation in separate tabs, preserving the presentation position. Default demo URL: http://localhost:5173. API reference: http://127.0.0.1:8000/docs. Override using query parameters, for example `?demo=http%3A%2F%2Flocalhost%3A5173&api=http%3A%2F%2F127.0.0.1%3A8000%2Fdocs#11`. Only HTTP(S) URLs are accepted. Starting the presentation does not start the application or backend.

## Rehearsal

- Allocate about 8–9 minutes to the slides and five minutes to the live demonstration. Appendix slides are for questions.
- Confirm the application and backend are running. Preselect a project, mentor, HoD and assistant with matching department/lab assignments. Use synthetic accounts. Do not rely on seed IDs from older runbooks without checking them.
- Walk through one consumable request to minimize role switches. For an asset, include Lab In-Charge approval. Show available stock, submission, approvals, issue, return condition and history. Show email only if actual receipt occurs.
- Keep the presentation tab open at slide 11. Return after the demo and advance to slide 12.
- Root UI inventory/custody actions currently use browser storage. The separate TypeScript client uses the backend API. Do not use a polished UI walkthrough as evidence of SQL atomicity or distributed concurrency.
- The fresh backend review run recorded 61 passed, two skipped and zero failures on 19 October. The skipped MySQL/Mongo service checks are not claimed as validated.

## Rubric coverage

Topic submission: existing project submission materials. Research: slides 3–4 and LITERATURE.md. Presentation skills: timed narrative and notes. Running example: slide 11 and live service. Viva: architecture, state boundaries, failure handling and appendix. Exact official allocation is reproduced on slide 14.

Sources: CCE evaluation rubric, approved SDD, faculty notes, the current source code, code/runtime review and the backend test report. Narrative flow avoids unsupported JWT, PostgreSQL, cloud-deployment and production-readiness claims. Images use existing local repository assets. No network fonts or CDN assets are required by the presentation.

Website styling update: the deck now matches the current LabTrack charcoal/champagne-gold identity and bundles the website's Clash Display and Inter fonts locally. See RUBRIC_CHECK.md for the criterion-by-criterion coverage and rehearsal responsibilities.
