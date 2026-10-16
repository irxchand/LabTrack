# Execution decisions and policy boundaries

Updated: 2026-10-16. This file tracks the authorized execution session; it does not rewrite the master context or silently close original ASTRA decisions. The explicit override in ASTRA/EXECUTION_OVERRIDE_2026-10-16.md authorizes execution independently of the unapproved SDD draft.

| Original item | Execution treatment |
|---|---|
| OD-01 structural identity | SDD-only; not an execution blocker |
| OD-02 source authority | User explicitly selects current Master Context/current material as execution basis |
| OD-03 recipients | Use explicitly normative AA6/UAQ32. Mentor rejection notifies student; faculty decision remains in timeline; no next actor delivery |
| OD-04 reservation | Queue enrollment/history is implementable. Expiry anchor requested from user; hold creation/fulfilment-to-approval bridge and scarcity remain open |
| OD-05 revisions | Initial project/team creation and lead submission implementable. Lead transfer, submitted edits and removal affecting custody remain blocked |
| OD-06 approvals | Single-class requests and asset requests with one responsible In-Charge implementable. Mixed classes and multiple In-Charges remain blocked |
| OD-07 claims | Atomic first claim implementable. Claim stealing/reassignment has no invented timeout |
| OD-08 overwrite | No unrestricted record editor or discretionary FIFO reorder until invariants/authority are specified |
| OD-09 allocation | Exact documented lab-set objectives; stable lab-ID per-line distribution is an engineering convention. No post-approval automatic replan |
| OD-10 issue | USER CONFIRMED: entire request across all labs. All inventory/issue/audit/outbox mutations commit together. Multi-operator physical coordination remains open |
| OD-11 timing | UTC storage is technical. Ordinary requested durations/extensions preserve history; overdue extension and automated reminder/calendar catch-up remain blocked pending business semantics |
| OD-12 durability | SQL canonical audit and outbox; idempotent document upserts; independent channels. Ambiguous external email sends enter UNKNOWN, not blind retry. These are engineering recovery choices |
| OD-13 score | User scope question pending. Condition/incident history is independent; no automatic attribution, numeric score, penalty or access restriction inferred |
| OD-14 auth | Replaceable opaque-token synthetic AuthProvider; PBKDF2 hashes; current server-side role/lab checks. Institutional protocol deferred |
| OD-15 maintenance | Fixture loading is an offline development CLI. No invented live catalogue/stock administrator role. HoD may view departmental analytics under recorded Super Access |
| OD-16 reconciliation | Complete ordinary same-source-lab reconciliation implementable. Staged/cross-lab returns, retention approval, repair authority and disputed acknowledgement remain open |
| OD-17 evidence | Validated image uploads and authorized references; required damaged-asset evidence honored. No exception bypass or retention duration inferred |
| OD-18 AI | Optional deterministic curated alternatives work without AI. External BrowserAPIFree contract absent; do not claim live LLM integration |
| OD-19 academic features | CSV/JSON fixture/export, demand/usage reporting, meaningful SQL routine and Mongo aggregation are documented engineering selections serving recorded requirements |
| OD-20 contracts | FastAPI OpenAPI snapshot/generated TS types/stable errors; unapproved SDD draft exists, with disclosed desired/as-built differences |
| OD-21 deployment | Docker artifacts can be prepared; engine unavailable locally. No paid deployment/accounts or invented DR readiness. Single primary role remains configured |
| OD-22 academia | Registration and production ownership do not block local demo; dates remain supplied tentative dates |

Operations blocked by policy must identify the OD and leave business state unchanged. The UI must distinguish implemented functionality, configured adapters and blocked operations.

Technical correction on2026-10-16: session-generation/refresh-sequence checks prevent delayed prior-login responses from changing the current workspace. Sign-out has no automatic refresh; role-specific data/forms clear on identity switch. Current401 invalidates auth; transient refresh errors preserve login. This implements existing identity isolation, not new business policy. Three deterministic delayed-response scenarios and the final lifecycle/additional feature smoke tests pass; see VALIDATION_REPORT.md.
