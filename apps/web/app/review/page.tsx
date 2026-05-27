"use client";

import { MaintainerReviewContextPanel, type MaintainerReviewContext } from "@/components/maintainer-review-context";
import { ReviewSLAIndicators, type SLAIndicator } from "@/components/review-sla-indicators";
import { AbuseRiskFlags, type RiskFlag } from "@/components/abuse-risk-flags";

const MOCK_REVIEW_CONTEXT: MaintainerReviewContext[] = [
  {
    reviewerLogin: "maintainer-a",
    reviewState: "changes_requested",
    submittedAt: "May 25, 14:30",
    reviewWindowDeadline: "May 28, 14:30",
    unresolvedComments: [
      {
        author: "maintainer-a",
        body: "The error handling path is missing a rollback call.",
        createdAt: "May 25, 14:32",
        resolved: false,
      },
    ],
    resolvedComments: [],
  },
];

const MOCK_SLA: SLAIndicator[] = [
  { label: "Review window", deadline: "May 28, 14:30", hoursRemaining: 18, status: "at_risk" },
  { label: "Appeal deadline", deadline: "May 30, 00:00", hoursRemaining: 60, status: "on_track" },
];

const MOCK_FLAGS: RiskFlag[] = [
  {
    level: "medium",
    category: "Unusual claim pattern",
    displayReason: "This claim was submitted shortly after a similar claim was rejected.",
  },
];

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Review context</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Maintainer review details, SLA timers, and risk signals for this issue.
        </p>
      </div>
      <ReviewSLAIndicators indicators={MOCK_SLA} />
      <AbuseRiskFlags flags={MOCK_FLAGS} />
      <MaintainerReviewContextPanel context={MOCK_REVIEW_CONTEXT} />
    </div>
  );
}
