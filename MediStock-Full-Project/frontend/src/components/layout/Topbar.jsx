import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

export default function Topbar({ title, onSearch, onMenu }) {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-surface px-4 md:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="focus-ring grid h-9 w-9 place-items-center rounded text-muted hover:bg-bg hover:text-ink md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>

      {onSearch && (
        <div className="relative ml-2 hidden max-w-xs flex-1 md:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search medicines, batches, suppliers..."
            onChange={(e) => onSearch(e.target.value)}
            className="focus-ring w-full rounded border border-line bg-bg py-2 pl-8 pr-3 text-sm text-ink placeholder:text-muted"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => navigate("/app/notifications")}
          className="focus-ring relative grid h-9 w-9 place-items-center rounded text-muted hover:bg-bg hover:text-ink"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-crit px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="focus-ring flex items-center gap-2 rounded py-1.5 pl-1.5 pr-2 hover:bg-bg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-xs font-semibold text-white">
              {user?.name?.slice(0, 1) || "U"}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-none text-ink">{user?.name}</span>
              <span className="block text-[11px] leading-none text-muted mt-0.5">{user?.role}</span>
            </span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-44 rounded border border-line bg-surface py-1 shadow-card">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-bg"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
