"use client";

import { useState } from "react";
import { NotificationCenter, type WaveNotification } from "@/components/notification-center";

const INITIAL: WaveNotification[] = [
  {
    id: "1",
    category: "budget",
    title: "Budget nearly exhausted",
    body: "soroban-dev-console has less than 20% budget remaining.",
    timestamp: "2m ago",
    read: false,
    href: "/budgets",
  },
  {
    id: "2",
    category: "review",
    title: "Review SLA approaching",
    body: "Issue #42 review window closes in 3 hours.",
    timestamp: "15m ago",
    read: false,
    href: "/review",
  },
  {
    id: "3",
    category: "appeal",
    title: "Appeal decision reached",
    body: "Your appeal for issue #38 has been approved.",
    timestamp: "1h ago",
    read: true,
    href: "/appeals/status",
  },
  {
    id: "4",
    category: "verification",
    title: "Verification complete",
    body: "Your identity verification has been approved.",
    timestamp: "2h ago",
    read: true,
    href: "/verification",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<WaveNotification[]>(INITIAL);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <NotificationCenter
        notifications={notifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}
