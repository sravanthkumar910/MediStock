import { BellRing, CalendarClock, PackageMinus, Truck, CheckCheck } from "lucide-react";
import { useData } from "../context/DataContext";
import EmptyState from "../components/ui/EmptyState";

const ICONS = { expiry: CalendarClock, stock: PackageMinus, purchase: Truck };
const DOT = { critical: "bg-crit", warning: "bg-amber", info: "bg-info" };

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Notifications</h2>
          <p className="text-sm text-muted">{unread} unread of {notifications.length}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="focus-ring flex items-center gap-1.5 rounded border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-bg"
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="rounded-lg border border-line bg-surface shadow-card">
        {notifications.length === 0 ? (
          <EmptyState icon={BellRing} title="You're all caught up" />
        ) : (
          <ul className="divide-y divide-line">
            {notifications.map((n) => {
              const Icon = ICONS[n.type] || BellRing;
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3.5 ${!n.read ? "bg-primary-light/30" : ""}`}
                >
                  <span className="relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg text-muted">
                    <Icon size={15} />
                    {!n.read && (
                      <span className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${DOT[n.severity]}`} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${!n.read ? "font-medium text-ink" : "text-muted"}`}>{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.time}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="focus-ring shrink-0 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary-light"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
