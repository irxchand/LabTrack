# Presentation research context

Reviewed 2026-10-15. These are primary technical references for the literature/context discussion, not new LabTrack product requirements.

1. Snipe-IT official documentation, **Overview**: https://snipe-it.readme.io/docs/overview — check-in/check-out are central asset-custody concepts. The getting-started guide also discusses categories, notifications and configurable fields: https://snipe-it.readme.io/docs/getting-started.
2. GLPI official help centre, **Reservations**: https://help.glpi-project.org/documentation/modules/tools/reservations — assets can be reserved for time slots, including recurring reservations.
3. AWS Prescriptive Guidance, **Transactional outbox pattern**: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html — addresses the dual-write problem between a database transaction and event notification.

The presentation uses these references to recognize existing asset-management/reservation/reliability patterns. It does not assert that competitors lack particular features or that LabTrack is the first such system. LabTrack's project-specific contribution is the documented R&A project/role/class-specific workflow and custody model. No measured improvement percentages are inferred.
