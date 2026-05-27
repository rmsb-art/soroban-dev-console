"use client";

import { MessageSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export interface ReviewComment {
  author: string;
  body: string;
  createdAt: string;
  resolved: boolean;
}

export interface MaintainerReviewContext {
  reviewerLogin: string;
  reviewState: "approved" | "changes_requested" | "commented" | "pending";
  submittedAt?: string;
  unresolvedComments: ReviewComment[];
  resolvedComments: ReviewComment[];
  reviewWindowDeadline?: string;
}

interface MaintainerReviewContextPanelProps {
  context: MaintainerReviewContext[];
  loading?: boolean;
  error?: string;
  className?: string;
}

const REVIEW_STATE_CONFIG = {
  approved: { label: "Approved", icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />, color: "text-green-600" },
  changes_requested: { label: "Changes requested", icon: <AlertCircle className="h-3.5 w-3.5 text-red-500" />, color: "text-red-600" },
  commented: { label: "Commented", icon: <MessageSquare className="h-3.5 w-3.5 text-blue-500" />, color: "text-blue-600" },
  pending: { label: "Pending", icon: <Clock className="h-3.5 w-3.5 text-muted-foreground" />, color: "text-muted-foreground" },
};

/**
 * FE-209: Surfaces maintainer review context inside appeal and review views.
 * Shows unresolved comments, review state, and timing details.
 */
export function MaintainerReviewContextPanel({
  context,
  loading,
  error,
  className = "",
}: MaintainerReviewContextPanelProps) {
  if (loading) {
    return (
      <div className={`rounded-lg border bg-card p-4 animate-pulse space-y-3 ${className}`}>
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm text-destructive rounded-lg border bg-card p-4 ${className}`}>
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!context.length) {
    return (
      <div className={`rounded-lg border bg-card p-4 text-sm text-muted-foreground ${className}`}>
        No review context available.
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-4 ${className}`}>
      <h2 className="text-sm font-semibold">Maintainer review context</h2>
      {context.map((review, i) => {
        const stateConfig = REVIEW_STATE_CONFIG[review.reviewState];
        return (
          <div key={i} className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {stateConfig.icon}
                <span className="text-xs font-medium">@{review.reviewerLogin}</span>
                <span className={`text-xs ${stateConfig.color}`}>{stateConfig.label}</span>
              </div>
              {review.submittedAt && (
                <span className="text-xs text-muted-foreground">{review.submittedAt}</span>
              )}
            </div>

            {review.reviewWindowDeadline && (
              <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                Review window closes: {review.reviewWindowDeadline}
              </p>
            )}

            {review.unresolvedComments.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Unresolved ({review.unresolvedComments.length})
                </p>
                {review.unresolvedComments.map((c, j) => (
                  <div key={j} className="rounded-md bg-muted/50 px-3 py-2 text-xs space-y-0.5">
                    <p className="font-medium">@{c.author} · {c.createdAt}</p>
                    <p className="text-muted-foreground">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
