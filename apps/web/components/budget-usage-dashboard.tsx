"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";

export interface BudgetScope {
  label: string;
  allocated: number;
  consumed: number;
  reserved: number;
}

interface BudgetUsageDashboardProps {
  scopes: BudgetScope[];
  loading?: boolean;
  error?: string;
  className?: string;
}

function BudgetBar({ consumed, reserved, allocated }: { consumed: number; reserved: number; allocated: number }) {
  const consumedPct = Math.min((consumed / allocated) * 100, 100);
  const reservedPct = Math.min((reserved / allocated) * 100, 100 - consumedPct);
  const isNearCap = consumedPct + reservedPct > 80;

  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
      <div
        className={`h-full transition-all ${isNearCap ? "bg-red-500" : "bg-primary"}`}
        style={{ width: `${consumedPct}%` }}
      />
      <div
        className="h-full bg-amber-400 transition-all"
        style={{ width: `${reservedPct}%` }}
      />
    </div>
  );
}

/**
 * FE-201: Repo and org point budget usage dashboard for maintainers.
 * Shows consumed, reserved, and remaining budget per scope.
 */
export function BudgetUsageDashboard({
  scopes,
  loading,
  error,
  className = "",
}: BudgetUsageDashboardProps) {
  if (loading) {
    return (
      <div className={`rounded-lg border bg-card p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-2 w-full rounded bg-muted" />
          <div className="h-2 w-full rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border bg-card p-4 flex items-center gap-2 text-sm text-destructive ${className}`}>
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!scopes.length) {
    return (
      <div className={`rounded-lg border bg-card p-4 text-sm text-muted-foreground ${className}`}>
        No budget data available.
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-4 ${className}`}>
      <h2 className="text-sm font-semibold">Point budget usage</h2>
      {scopes.map((scope) => {
        const remaining = scope.allocated - scope.consumed - scope.reserved;
        const isNearCap = remaining / scope.allocated < 0.2;
        return (
          <div key={scope.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{scope.label}</span>
              <span className={`font-mono ${isNearCap ? "text-red-500" : "text-muted-foreground"}`}>
                {remaining.toLocaleString()} / {scope.allocated.toLocaleString()} pts remaining
              </span>
            </div>
            <BudgetBar
              consumed={scope.consumed}
              reserved={scope.reserved}
              allocated={scope.allocated}
            />
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Consumed: {scope.consumed.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                Reserved: {scope.reserved.toLocaleString()}
              </span>
            </div>
            {isNearCap && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <TrendingDown className="h-3 w-3" />
                Budget nearly exhausted for this scope.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
