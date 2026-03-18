import React from "react";
import { Bell, Check, BellDot } from "lucide-react";
import type { CommunityNotification } from "@/types/community.types";

type CommunityNotificationsProps = {
  notifications: CommunityNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
};

const timeAgo = (isoDate: string) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const CommunityNotifications: React.FC<CommunityNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unread = notifications.filter((item) => !item.isRead).length;

  return (
    <section className="rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unread > 0 && (
            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
              {unread} new
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-white/60 transition-colors hover:text-white"
          >
            Mark all read
          </button>
        )}
      </header>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/10 bg-white/2 p-4 text-center text-xs text-white/50">
            You are all caught up.
          </div>
        )}

        {notifications.map((item) => (
          <article
            key={item.id}
            className={`rounded-lg border p-3 transition-all ${
              item.isRead
                ? "border-white/6 bg-white/2"
                : "border-sky-500/35 bg-sky-500/10"
            }`}
          >
            <div className="mb-1 flex items-start justify-between gap-3">
              <p className="text-xs text-white/80">{item.message}</p>
              {!item.isRead ? (
                <BellDot className="h-3.5 w-3.5 shrink-0 text-sky-300" />
              ) : (
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/45">{timeAgo(item.createdAt)}</p>
              {!item.isRead && (
                <button
                  onClick={() => onMarkAsRead(item.id)}
                  className="text-[11px] text-sky-300 transition-colors hover:text-sky-200"
                >
                  Mark read
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CommunityNotifications;
