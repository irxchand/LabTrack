import React from 'react';
import { Check } from 'lucide-react';

/**
 * normalizeRequisitionTimeline
 * Authoritative lifecycle timeline normalizer across ALL institutional portals:
 * - Student Portal (RequisitionsPage)
 * - Faculty Mentor Portal (ApprovalsQueuePage)
 * - HoD / Executive Admin Portal (ApprovalsQueuePage)
 * - Lab Assistant / Counter Custodian Portal (DispatchDeskPage)
 *
 * Guarantees that:
 * - Completed events have completed: true, valid timestamp, and tick checkmark.
 * - Incomplete / pending events have completed: false, timestamp: null, dashed circular node with NO tick mark,
 *   and dashed connector line.
 */
export function normalizeRequisitionTimeline(req) {
  if (!req) return [];
  const statusLower = String(req.status || '').toLowerCase();
  const isRejected = statusLower.includes('reject');
  const isReturned = statusLower.includes('return');
  const isDispatched = statusLower.includes('dispatch') || isReturned;
  const isHodSanctioned = statusLower.includes('counter') || statusLower.includes('ready') || isDispatched || Boolean(req.hodSanctionedBy);
  const isEndorsed = statusLower.includes('endorse') || isHodSanctioned || Boolean(req.supervisorNotes);

  const rawTimeline = Array.isArray(req.timeline) && req.timeline.length > 0 ? req.timeline : [
    {
      step: 'Request Submitted',
      stage: 'Request Submitted',
      actor: `${req.studentName || req.submittedBy || 'Student'} (${req.studentPrn || req.borrowerPrn || 'PRN'})`,
      timestamp: req.requestDate || req.createdAt || new Date().toISOString(),
      note: 'Curriculum proposal and bill of materials submitted.',
    },
    {
      step: 'Faculty Mentor Review',
      stage: 'Mentor Review',
      actor: req.mentorName || 'Faculty Guide',
      note: req.supervisorNotes || 'Pending academic mentor endorsement.',
    },
    {
      step: 'HoD Review',
      stage: 'HoD Review',
      actor: req.hodSanctionedBy || 'Dr. Sumit Kumar (HoD)',
      note: req.hodSanctionedNotes || 'Pending department executive sanction.',
    },
    {
      step: 'Counter Dispatch & Handover',
      stage: 'Counter Dispatch',
      actor: req.dispatchedBy || 'Ramesh Patil (Lab Assistant)',
      note: 'Pending physical custody handover at dispatch counter.',
    },
    {
      step: 'Hardware Return & Restock',
      stage: 'Return',
      actor: 'Ramesh Patil (Lab Assistant)',
      note: 'Hardware custody in circulation.',
    },
  ];

  return rawTimeline.map((step, idx) => {
    const stepText = `${step.step || ''} ${step.stage || ''}`.toLowerCase();

    // 1. Initial Submission
    if (idx === 0 || stepText.includes('submit')) {
      return {
        ...step,
        completed: true,
        timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
        actor: step.actor || `${req.studentName || req.submittedBy || 'Student'} (${req.studentPrn || 'PRN'})`,
      };
    }

    // 2. Central Store / Pre-validation if present
    if (stepText.includes('store') || stepText.includes('validation')) {
      return {
        ...step,
        completed: true,
        timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
        actor: step.actor || 'System Verification',
      };
    }

    // 3. Faculty Mentor Review
    if (stepText.includes('mentor') || stepText.includes('faculty') || stepText.includes('supervisor')) {
      if (isEndorsed && !isRejected) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
          actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.mentorName || 'Faculty Guide'}`,
          note: step.note || req.supervisorNotes || 'Approved for departmental coursework milestones.',
        };
      }
      return {
        ...step,
        completed: false,
        timestamp: null,
        actor: step.actor || `${req.mentorName || 'Faculty Guide'}`,
      };
    }

    // 4. HoD Department Sanction
    if (stepText.includes('hod') || stepText.includes('sanction') || stepText.includes('department head')) {
      if (isHodSanctioned && !isRejected) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
          actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.hodSanctionedBy || 'Dr. Sumit Kumar (HoD)'}`,
          note: step.note || req.hodSanctionedNotes || 'Department allocation sanctioned by HoD. Passed to Counter Desk.',
        };
      }
      return {
        ...step,
        completed: false,
        timestamp: null,
        actor: step.actor || `${req.hodSanctionedBy || 'Dr. Sumit Kumar (HoD)'}`,
      };
    }

    // 5. Lab / Counter Dispatch
    if (stepText.includes('dispatch') || stepText.includes('custody') || stepText.includes('handover') || stepText.includes('pickup')) {
      if (isDispatched && !isRejected) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
          actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.dispatchedBy || 'Ramesh Patil (Lab Assistant)'}`,
          note: step.note || 'Physical hardware kit handover committed at counter desk.',
        };
      }
      return {
        ...step,
        completed: false,
        timestamp: null,
        actor: step.actor || 'Ramesh Patil (Lab Assistant)',
      };
    }

    // 6. Return & Restock
    if (stepText.includes('return') || stepText.includes('restock')) {
      if (isReturned) {
        return {
          ...step,
          completed: true,
          timestamp: step.timestamp || new Date().toISOString(),
          actor: step.actor && !step.actor.includes('N/A') ? step.actor : 'Ramesh Patil (Lab Assistant)',
          note: step.note || 'Hardware returned & restocked into central depot inventory pool.',
        };
      }
      return {
        ...step,
        completed: false,
        timestamp: null,
        actor: step.actor || 'Ramesh Patil (Lab Assistant)',
      };
    }

    // Explicit fallback
    const isExplicitlyCompleted = step.completed === true && Boolean(step.timestamp) && !String(step.timestamp).toLowerCase().includes('pending');
    return {
      ...step,
      completed: isExplicitlyCompleted,
      timestamp: isExplicitlyCompleted ? step.timestamp : null,
    };
  });
}

/**
 * AuditTimelineProgression
 * Executive, Apple Cupertino-grade timeline progression component.
 * - Completed events render a molten champagne gold circular badge with a crisp tick (<Check />).
 * - Pending/uncompleted events render a dashed circular node with NO tick mark.
 * - Transitions to incomplete/pending steps feature an explicit full-height DASHED line.
 * - Strict 3-color palette: Champagne Gold (#c9b8a0), Obsidian Black (#0a0a0c), Pure White (#ffffff).
 */
export function AuditTimelineProgression({ steps = [], className = '' }) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-zinc-500 font-sans italic">
        No audit progression events recorded yet.
      </div>
    );
  }

  const isStepCompleted = (step) => {
    if (!step) return false;
    // Strict boolean requirement: must be explicitly true, and timestamp must NOT be pending or null
    if (step.completed === true) {
      if (!step.timestamp || step.timestamp === 'Pending' || String(step.timestamp).toLowerCase().includes('pending')) {
        return false;
      }
      return true;
    }
    return false;
  };

  const formatTimestamp = (ts, isCompleted) => {
    if (!isCompleted || !ts || ts === 'Pending' || String(ts).toLowerCase().includes('pending')) {
      return 'Pending Authorization';
    }
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return String(ts);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(ts);
    }
  };

  return (
    <div className={`space-y-0 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = isStepCompleted(step);
        const isLast = idx === steps.length - 1;
        const nextStep = steps[idx + 1];
        const isNextStepCompleted = isStepCompleted(nextStep);

        const title = step.stage || step.step || `Milestone 0${idx + 1}`;
        const actor = step.actor || 'Pending authorization';
        const timestamp = formatTimestamp(step.timestamp || step.created_at, isCompleted);
        const note = step.note || step.remarks || step.details;

        return (
          <div key={idx} className="relative flex items-start gap-3.5 pb-6 last:pb-1">
            {/* Continuous Vertical Connector Line to Next Step */}
            {!isLast && (
              <div
                className={`absolute left-[11px] top-6 bottom-0 w-0 ${
                  isCompleted && isNextStepCompleted
                    ? 'border-l-2 border-[#c9b8a0]'
                    : 'border-l-2 border-dashed border-[#c9b8a0]/50'
                }`}
              />
            )}

            {/* Left Node Icon Circle */}
            <div className="relative z-10 flex-shrink-0">
              {isCompleted ? (
                <div
                  className="w-6 h-6 rounded-full bg-[#c9b8a0] border border-[#f5e6c8] text-black flex items-center justify-center shadow-[0_0_12px_rgba(201,184,160,0.35)]"
                  title="Completed Milestone"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-full border-2 border-dashed border-[#c9b8a0]/50 bg-[#0c0d12] flex items-center justify-center"
                  title="Pending Authorization"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-sans text-xs font-semibold tracking-tight ${
                    isCompleted ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {title}
                </span>
                <span
                  className={`text-[11px] font-sans flex-shrink-0 ${
                    isCompleted ? 'text-zinc-400' : 'text-[#c9b8a0]/70 italic'
                  }`}
                >
                  {timestamp}
                </span>
              </div>

              <div className="text-[11px] font-sans text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <span className="text-zinc-500">Recorded by:</span>
                <span className={isCompleted ? 'text-[#c9b8a0] font-medium' : 'text-zinc-400'}>
                  {actor}
                </span>
              </div>

              {note && isCompleted && (
                <div className="mt-2 text-xs font-sans text-zinc-300 bg-white/[0.025] p-3 rounded-xl border border-white/10 leading-relaxed italic backdrop-blur-sm">
                  "{note}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AuditTimelineProgression;
