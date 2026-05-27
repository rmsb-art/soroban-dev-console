"use client";

import { ShieldAlert, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export type RiskLevel = "low" | "medium" | "high";

export interface RiskFlag {
  level: RiskLevel;
  category: string;
  /** Generic reason shown to maintainers — must NOT expose detection logic */
  displayReason: string;
}

interface AbuseRiskFlagsProps {
  flags: RiskFlag[];
  className?: string;
}

const LEVEL_CONFIG: Record<RiskLevel, { colorClass: string; label: string }> = {
  low: {
    colorClass: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
    label: "Low risk",
  },
  medium: {
    colorClass: "border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400",
    label: "Medium risk",
  },
  high: {
    colorClass: "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
    label: "High risk",
  },
};

/**
 * FE-211: Abuse and risk flag display for maintainer views.
 * Shows moderation-safe risk badges without exposing detection heuristics.
 * Maintainers can reveal/hide details to reduce noise.
 */
export function AbuseRiskFlags({ flags, className = "" }: AbuseRiskFlagsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!flags.length) return null;

  const highestLevel: RiskLevel = flags.some((f) => f.level === "high")
    ? "high"
    : flags.some((f) => f.level === "medium")
    ? "medium"
    : "low";

  const config = LEVEL_CONFIG[highestLevel];

  return (
    <div className={`rounded-md border p-3 space-y-2 ${config.colorClass} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <ShieldAlert className="h-3.5 w-3.5" />
          {flags.length === 1 ? "Risk flag" : `${flags.length} risk flags`} · {config.label}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
          aria-expanded={expanded}
        >
          {expanded ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {expanded ? "Hide" : "Show"} details
        </button>
      </div>

      {expanded && (
        <ul className="space-y-1.5">
          {flags.map((flag, i) => (
            <li key={i} className="text-xs space-y-0.5">
              <p className="font-medium">{flag.category}</p>
              <p className="opacity-80">{flag.displayReason}</p>
            </li>
          ))}
        </ul>
      )}

      {!expanded && (
        <p className="text-xs opacity-70">
          Review carefully before approving. Expand for details.
        </p>
      )}
    </div>
  );
}

/**
 * FE-211: Compact risk badge for use in issue cards and queue rows.
 */
export function RiskBadge({ level }: { level: RiskLevel }) {
  const config = LEVEL_CONFIG[level];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.colorClass}`}
    >
      <ShieldAlert className="h-3 w-3" />
      {config.label}
    </span>
  );
}
