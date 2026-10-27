# CCE rubric alignment

Checked against docs/academic/CCE_Evaluation_Plan.pdf, page 2. The presentation/viva component totals 30 marks. This map documents coverage, not an assurance of awarded marks.

| Official criterion | Marks | Deck coverage | Presenter responsibility |
| --- | ---: | --- | --- |
| Topic Submission | 5 | Slide 1 identifies LabTrack; the project materials remain the topic-submission evidence | Confirm the faculty has received and can access the submission. The Drive folder and acceptance have not been verified. |
| Research and literature survey | 5 | Slides 3–4 apply authoritative sources to SMTP/outbox, FastAPI, FIFO, transactions, cloud databases, Docker and SHA-256; LITERATURE.md contains the annotated review | Explain the design lessons and distinguish current implementation from target architecture. |
| Presentation skills | 5 | 15-slide narrative, website-matched visual identity, large type, speaker notes, navigation and timer | Rehearse within 12–15 minutes, including the live demo. The two appendix slides are for questions. |
| Running Example | 10 | Slide 11 reserves five minutes for website orientation plus a server-backed request lifecycle; slide 12 shows a controlled failure | Run the actual service. Verify role mappings and stock first. Show the state changes. The root UI workflow is presented as interface evidence, not proof of SQL atomicity. |
| Viva | 5 | Slides 6–10 explain the implementation boundary, lifecycle, inventory rules, state and validation; slides 13 and 16 give trade-offs and answer anchors | Be ready to explain SQL vs MongoDB, worker separation, idempotency, local SQLite versus MySQL validation, the literature basis and the remaining integration work. |

## Visual identity

Matches the current website's charcoal/glass surfaces, champagne gold (#c9b8a0), gradient wordmark and gold action buttons. Local copies of Clash Display (600/700, Fontshare) and Inter (400/600, Google Fonts) avoid a presentation-time font download. Website reference: src/styles/tokens.css, src/pages/auth/LoginPage.jsx and src/pages/HeroPage.jsx.

## Demonstration readiness

This presentation does not start the application or backend. Confirm both are available, rehearse a matching department/project/role sequence, and do not send email during the evaluation. Existing root UI workflows and backend transaction tests remain distinct. The dated backend test result is evidence for the tested server workflow, not a claim that every external service is live.
