# LabTrack — Gemini → Google Slides workflow (V2)

## Why this replaces the original pack
The old eight-reference pack plus master prompt instructed Gemini to generate the **entire PPTX at once**. That did not match the intended workflow. This V2 pack is deliberately optimized for **one-time context ingestion + faculty template ingestion + style calibration + screenshot-driven one-slide editing in Google Slides**. There is NO full-deck build prompt.

## Uploads — only 4 permanent context documents
Upload to the same Gemini conversation:
1. `CONTEXT/00_REFERENCE_ROUTER.md`
2. `CONTEXT/01_PROJECT_AND_TECHNICAL_TRUTH.md`
3. `CONTEXT/02_OFFICIAL_SLIDES_RUBRIC_AND_UNIT3.md`
4. `CONTEXT/03_STYLE_PROOF_AND_SPEAKING.md`

The official PPTX is uploaded **in Stage 2**, and each target slide screenshot is uploaded **only when editing that slide**. Do not upload an entire historical CCE repository to Gemini merely for design. The user can attach new QA and SQL evidence later as needed.

## Stage-by-stage prompt chart
| Stage | Upload/attach to Gemini | Send this prompt | Gemini should do | Gemini must NOT do |
|---|---|---|---|---|
| **1. Ingest once** | Four CONTEXT markdown files | `PROMPTS/01_INGEST_ONCE.txt` | Read and build reference index + 13-slide registry | Create slides or repeat full docs |
| **2. Faculty template** | `TEMPLATE/DCDS_ESE_Project_Presentation_Template.pptx` | `PROMPTS/02_INGEST_FACULTY_TEMPLATE.txt` | Understand headings/footer/slide geometry; identify Slides import workflow | Generate whole deck |
| **3. Lock style** | No new file; optional design screenshot | `PROMPTS/03_LOCK_STYLE_AND_SPEAKING.txt` | Lock colors/fonts/pointers/flowchart grammar | Make slides |
| **4. Work on Slide N** | Screenshot of Slide N + target Google Slides URL if not established | `PROMPTS/04_BUILD_ONE_SLIDE_REUSE.txt` | Build/edit ONLY Slide N as native editable Google Slides content; speaker cues | Flatten slide or hallucinate results |
| **5. Revise Slide N** | Feedback + current screenshot (optional) | `PROMPTS/05_REVISE_ONE_SLIDE_REUSE.txt` | Revise only named slide | Redesign entire deck |
| **6. New evidence arrives** | QA, MySQL, Mongo, screenshots, ER/schema/test output | `PROMPTS/06_INGEST_NEW_EVIDENCE_REUSE.txt` | Update claim registry and list affected slides | Silently fabricate or overwrite |
| **7. Final audit** | Complete Google Slides link | `PROMPTS/07_FINAL_PRESENTATION_AUDIT.txt` | Check the 13 slides against official rubric & factual evidence | Assume 10/10 or auto-edit |

## Important prerequisite for actual Google Slides editing
The Gemini environment needs a **connected, authorized Google Slides editing capability**, plus access to the destination Slides presentation. If Gemini cannot actually use such a tool, no prompt can make it perform an edit. Import the official `.pptx` into Google Slides, open the imported Slides file, and give Gemini the URL when it asks. In absence of an editing tool, the prompt instructs Gemini to return editable textbox copy and native-shape placement instructions instead of pretending it edited anything.

## The desired repeating user flow
1. Stay in same Gemini chat after stages 1–3.
2. Upload screenshot of the next slide to improve.
3. On the first slide, use `04_BUILD_ONE_SLIDE_REUSE.txt` to establish the working procedure. On later slides in the SAME Gemini chat, use only the short prompt below with the new screenshot and slide number; do NOT re-paste the full file each time.
4. Inspect the created slide in Google Slides; if needed, use prompt 05 with specific feedback.
5. When real results arrive, use prompt 06 once with actual output so future slides reference verified status.
6. At the end run prompt 07. Keep official PPTX order/mandatory title and footer.

## Minimal repeated prompt after Gemini has accepted the long reusable prompt
`Work on Slide 08. Screenshot attached. Use [S08] from 02, truth from 01 and style from 03. Create/edit only Slide 08 in this Google Slides deck: [URL]. Editable elements; pointer text; placeholders for unverified output.`

## Design language in one sentence
**Dark navy `#111827`, electric teal `#23C8B7`, deep teal `#0D9488`, mist `#F8FAFC`; Arial headings/body, crisp editable flowcharts, 3–5 cue pointers, not theory paragraphs; preserve faculty template.**

## Truth in one sentence
Aiven MySQL is the chosen **target**, MongoDB Atlas is **user-reported live**, UI QA and current query results are **pending**, and SIT deployment is the **future vision**. Replace these qualifiers only after receiving real evidence.
