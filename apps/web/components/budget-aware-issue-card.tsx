"use client";

import { AlertTriangle, Coins } from "lucide-react";

export interface IssueBudgetContext {
  pointValue: number;
  remainingBudget: number;
  wouldExceedBudget: boolean;
  lowBudgetWarning: boolean;
}

interface BudgetAwareIssueBadgeProps {
  budget: IssueBudgetContext;
  className?: string;
}

/**
 * FE-203: Inline budget badge for issue cards.
 * Shows point value and warns when assignment would leave little remaining budget.
 */
export function BudgetAwareIssueBadge({
  budget,
  className = "",
}: BudgetAwareIssueBadgeProps) {
  if (budget.wouldExceedBudget) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 ${className}`}
      >
        <AlertTriangle className="h-3 w-3" />
        Exceeds budget
      </span>
    );
  }

  if (budget.lowBudgetWarning) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 ${className}`}
      >
        <Coins className="h-3 w-3" />
        {budget.pointValue.toLocaleString()} pts · low budget
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ${className}`}
    >
      <Coins className="h-3 w-3" />
      {budget.pointValue.toLocaleString()} pts
    </span>
  );
}

interface BudgetAwareActionProps {
  budget: IssueBudgetContext;
  children: React.ReactNode;
  actionLabel?: string;
}

/**
 * FE-203: Wraps a maintainer action (label, accept, merge) with a budget warning
 * when the action would leave little remaining budget.
 */
export function BudgetAwareAction({
  budget,
  children,
  actionLabel = "this action",
}: BudgetAwareActionProps) {
  if (!budget.wouldExceedBudget && !budget.lowBudgetWarning) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-1.5">
      {children}
      <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3 shrink-0" />
        {budget.wouldExceedBudget
          ? `${actionLabel} would exceed the remaining budget (${budget.remainingBudget.toLocaleString()} pts left).`
          : `Budget is low after ${actionLabel} (${(budget.remainingBudget - budget.pointValue).toLocaleString()} pts remaining).`}
      </p>
    </div>
  );
}
