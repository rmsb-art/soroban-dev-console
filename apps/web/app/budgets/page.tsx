"use client";

import { BudgetUsageDashboard, type BudgetScope } from "@/components/budget-usage-dashboard";
import { BurnRateWidgets, type BurnRateData } from "@/components/burn-rate-widgets";

const MOCK_SCOPES: BudgetScope[] = [
  { label: "Org: stellar-org", allocated: 50000, consumed: 32000, reserved: 5000 },
  { label: "Repo: soroban-dev-console", allocated: 10000, consumed: 8500, reserved: 800 },
];

const MOCK_BURN: BurnRateData[] = [
  {
    scope: "stellar-org",
    dailyBurnRate: 1200,
    daysRemaining: 11,
    trend: "up",
    remainingPoints: 13000,
    totalPoints: 50000,
  },
  {
    scope: "soroban-dev-console",
    dailyBurnRate: 300,
    daysRemaining: 2,
    trend: "up",
    remainingPoints: 700,
    totalPoints: 10000,
  },
];

export default function BudgetsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Budget dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Repo and org point budget usage for Wave 5.
        </p>
      </div>
      <BudgetUsageDashboard scopes={MOCK_SCOPES} />
      <div>
        <h2 className="text-sm font-semibold mb-3">Burn rate</h2>
        <BurnRateWidgets items={MOCK_BURN} />
      </div>
    </div>
  );
}
