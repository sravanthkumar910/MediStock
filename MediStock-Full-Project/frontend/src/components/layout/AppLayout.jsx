import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/app": "Dashboard",
  "/app/medicines": "Medicine Inventory",
  "/app/stock-alerts": "Stock Alerts",
  "/app/expiry": "Expiry Tracking",
  "/app/suppliers": "Suppliers",
  "/app/categories": "Categories",
  "/app/purchase-orders": "Purchase Orders",
  "/app/reports": "Reports & Export",
  "/app/notifications": "Notifications",
  "/app/users": "Users & Roles",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { loading, error, refresh } = useData();
  const title = TITLES[pathname] || "MediStock";

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-ink/30 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenu={() => setMobileNavOpen((open) => !open)} />
        {error && (
          <div className="flex items-center justify-between gap-3 border-b border-crit/20 bg-crit-light px-4 py-2 text-xs text-crit md:px-6">
            <span>{error}</span>
            <button type="button" onClick={refresh} className="font-medium underline">Retry</button>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading && <p className="mb-4 text-xs text-muted">Loading live inventory...</p>}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
