"use client";

import { Bell, CheckCheck, Coins, ShieldCheck, GitPullRequest, MessageSquare } from "lucide-react";
import { useState } from "react";

export type NotificationCategory = "budget" | "review" | "appeal" | "verification";

export interface WaveNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

interface NotificationCenterProps {
  notifications: WaveNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  className?: string;
}

const CATEGORY_CONFIG: Record<NotificationCategory, { icon: React.ReactNode; colorClass: string }> = {
  budget: {
    icon: <Coins className="h-4 w-4" />,
    colorClass: "text-amber-500",
  },
  review: {
    icon: <GitPullRequest className="h-4 w-4" />,
    colorClass: "text-blue-500",
  },
  appeal: {
    icon: <MessageSquare className="h-4 w-4" />,
    colorClass: "text-purple-500",
  },
  verification: {
    icon: <ShieldCheck className="h-4 w-4" />,
    colorClass: "text-green-500",
  },
};

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  budget: "Budget",
  review: "Review",
  appeal: "Appeal",
  verification: "Verification",
};

/**
 * FE-212: Unified notification center for Wave 5 events.
 * Covers budgets, reviews, appeals, and verification in one surface.
 */
export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  className = "",
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "all" ? notifications : notifications.filter((n) => n.category === filter);

  return (
    <div className={`rounded-lg border bg-card flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-1 px-4 py-2 border-b overflow-x-auto">
        {(["all", "budget", "review", "appeal", "verification"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto divide-y">
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No notifications.
          </p>
        ) : (
          filtered.map((n) => {
            const catConfig = CATEGORY_CONFIG[n.category];
            const content = (
              <div
                className={`flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${
                  !n.read ? "bg-muted/20" : ""
                }`}
              >
                <span className={`mt-0.5 shrink-0 ${catConfig.colorClass}`}>
                  {catConfig.icon}
                </span>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-medium ${!n.read ? "font-semibold" : ""}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onMarkRead(n.id); }}
                    className="shrink-0 mt-0.5 h-2 w-2 rounded-full bg-primary hover:bg-primary/70 transition-colors"
                    aria-label="Mark as read"
                  />
                )}
              </div>
            );

            return n.href ? (
              <a key={n.id} href={n.href} className="block">
                {content}
              </a>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * FE-212: Notification bell icon with unread count badge.
 */
export function NotificationBell({ count }: { count: number }) {
  return (
    <div className="relative inline-flex">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}
