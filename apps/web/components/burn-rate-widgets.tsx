"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

export interface BurnRateData {
  scope: string;
  dailyBurnRate: number;
  daysRemaining: number | null;
  trend: "up" | "down" | "stable";
  remainingPoints: number;
  totalPoints: number;
}

interface BurnRateWidgetProps {
  data: BurnRateData;
}

interface BurnRateWidgetsProps {
  items: BurnRateData[];
  loading?: boolean;
  error?: string;
  className?: string;
}

const TREND_ICONS = {
  up: <TrendingUp className="h-3.5 w-3.5 text-red-500" />,
  down: <TrendingDown className="h-3.5 w-3.5 text-green-500" />,
  stable: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
};

function BurnRateWidget({ data }: BurnRateWidgetProps) {
  const pctUsed = ((data.totalPoints - data.remainingPoints) / data.totalPoints) * 100;
  const isAtRisk = data.daysRemaining !== null && data.daysRemaining < 7;

  return (
    <div className="rounded-md border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium truncate">{data.scope}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {TREND_ICONS[data.trend]}
          {data.dailyBurnRate.toLocaleString()} pts/day
        </span>
      </div>

      {/* Mini progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pctUsed > 80 ? "bg-red-500" : pctUsed > 60 ? "bg-amber-400" : "bg-primary"
          }`}
          style={{ width: `${Math.min(pctUsed, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(pctUsed)}% consumed</span>
        {data.daysRemaining !== null ? (
          <span className={isAtRisk ? "text-red-500 font-medium" : ""}>
            {isAtRisk && <AlertTriangle className="inline h-3 w-3 mr-0.5" />}
            ~{data.daysRemaining}d remaining
          </span>
        ) : (
          <span>On pace</span>
        )}
      </div>
    </div>
  );
}

/**
 * FE-202: Budget burn-rate and remaining-cap widgets for Wave tracking.
 * Shows consumed, reserved, and pace-to-exhaustion per scope.
 */
export function BurnRateWidgets({
  items,
  loading,
  error,
  className = "",
}: BurnRateWidgetsProps) {
  if (loading) {
    return (
      <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
        {[0, 1].map((i) => (
          <div key={i} className="rounded-md border bg-card p-3 animate-pulse space-y-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-1.5 w-full rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm text-destructive ${className}`}>
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className={`text-sm text-muted-foreground ${className}`}>
        No burn-rate data available.
      </p>
    );
  }

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {items.map((item) => (
        <BurnRateWidget key={item.scope} data={item} />
      ))}
    </div>
  );
}
