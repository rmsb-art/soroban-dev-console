"use client";

import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export type SLAStatus = "on_track" | "at_risk" | "breached";

export interface SLAIndicator {
  label: string;
  deadline: string;
  hoursRemaining: number | null;
  status: SLAStatus;
}

interface ReviewSLAIndicatorsProps {
  indicators: SLAIndicator[];
  className?: string;
}

const STATUS_CONFIG: Record<SLAStatus, { icon: React.ReactNode; colorClass: string; label: string }> = {
  on_track: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    colorClass: "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    label: "On track",
  },
  at_risk: {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    colorClass: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    label: "At risk",
  },
  breached: {
    icon: <Clock className="h-3.5 w-3.5" />,
    colorClass: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    label: "SLA breached",
  },
};

/**
 * FE-210: Review SLA and appeal timing indicators for maintainer queues.
 * Shows timers and queue-state so maintainers know when automated evaluation windows approach.
 */
export function ReviewSLAIndicators({ indicators, className = "" }: ReviewSLAIndicatorsProps) {
  if (!indicators.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {indicators.map((ind, i) => {
        const config = STATUS_CONFIG[ind.status];
        return (
          <div
            key={i}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.colorClass}`}
          >
            {config.icon}
            <span>{ind.label}</span>
            {ind.hoursRemaining !== null && (
              <span className="opacity-75">
                · {ind.hoursRemaining < 1
                  ? "<1h"
                  : ind.hoursRemaining < 24
                  ? `${ind.hoursRemaining}h`
                  : `${Math.round(ind.hoursRemaining / 24)}d`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * FE-210: Compact SLA timer badge for use in queue rows.
 */
export function SLATimerBadge({ indicator }: { indicator: SLAIndicator }) {
  const config = STATUS_CONFIG[indicator.status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${config.colorClass}`}
      title={`Deadline: ${indicator.deadline}`}
    >
      <Clock className="h-3 w-3" />
      {indicator.hoursRemaining !== null
        ? indicator.hoursRemaining < 1
          ? "<1h"
          : indicator.hoursRemaining < 24
          ? `${indicator.hoursRemaining}h`
          : `${Math.round(indicator.hoursRemaining / 24)}d`
        : config.label}
    </span>
  );
}
