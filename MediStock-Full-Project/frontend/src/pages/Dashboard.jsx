import { Boxes, CalendarClock, TriangleAlert, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { DashboardAPI, StockLogAPI } from "../api/endpoints";
import StatCard from "../components/ui/StatCard";
import StatusPill from "../components/ui/StatusPill";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { currency, expiryStatus, formatDate, stockStatus } from "../utils/format";

const PIE_COLORS = { ok: "#2F8F5B", warning: "#D98C2B", critical: "#C4433B", expired: "#C4433B" };

export default function Dashboard() {
  const { user } = useAuth();
  const { medicines, suppliers, orders, supplierName } = useData();
  const [summary, setSummary] = useState(null);
  const [movementLogs, setMovementLogs] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      DashboardAPI.summary(),
      StockLogAPI.history({ page: 0, size: 1000 }),
    ]).then(([summaryResult, movementResult]) => {
      if (!active) return;
      if (summaryResult.status === "fulfilled") setSummary(summaryResult.value.data);
      if (movementResult.status === "fulfilled") setMovementLogs(movementResult.value.data.content || []);
    });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const lowStock = medicines.filter((m) => stockStatus(m.quantity, m.reorderLevel).key !== "ok");
    const expiring = medicines.filter((m) => ["critical", "warning", "expired"].includes(expiryStatus(m.expiryDate).key));
    const inventoryValue = medicines.reduce((sum, m) => sum + m.quantity * m.price, 0);
    return { lowStock, expiring, inventoryValue };
  }, [medicines]);

  const stockMovementSeries = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - 6 + index);
      const key = localDateKey(date);
      return { key, day: date.toLocaleDateString(undefined, { weekday: "short" }), inbound: 0, outbound: 0 };
    });
    const daysByKey = new Map(days.map((day) => [day.key, day]));

    movementLogs.forEach((log) => {
      const date = new Date(log.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const day = daysByKey.get(localDateKey(date));
      if (!day) return;
      const change = log.quantityChanged || 0;
      day.inbound += Math.max(change, 0);
      day.outbound += Math.max(-change, 0);
    });

    return days;
  }, [movementLogs]);

  const watchlist = useMemo(
    () =>
      [...medicines]
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 6),
    [medicines]
  );

  const pieData = useMemo(() => {
    const buckets = { ok: 0, warning: 0, critical: 0 };
    medicines.forEach((m) => {
      const s = expiryStatus(m.expiryDate);
      const key = s.key === "expired" ? "critical" : s.key;
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return [
      { name: "Healthy", value: buckets.ok, key: "ok" },
      { name: "Near expiry", value: buckets.warning, key: "warning" },
      { name: "Critical / expired", value: buckets.critical, key: "critical" },
    ];
  }, [medicines]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">
          Welcome back, <span className="font-medium text-ink">{user?.name?.split(" ")[0]}</span> · {user?.role} view
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Medicines tracked" value={summary?.totalMedicines ?? medicines.length} sub={`${summary?.totalSuppliers ?? suppliers.length} suppliers`} icon={Boxes} />
        <StatCard
          label="Low / out of stock"
          value={summary?.lowStockCount ?? stats.lowStock.length}
          sub="Below reorder level"
          icon={TriangleAlert}
          tone="amber"
        />
        <StatCard
          label="Expiring soon"
          value={summary?.nearExpiryCount ?? stats.expiring.length}
          sub="Within 30 days"
          icon={CalendarClock}
          tone="crit"
        />
        <StatCard label="Inventory value" value={currency(summary?.totalInventoryValue ?? stats.inventoryValue)} sub="At current stock levels" icon={Truck} tone="ok" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold text-ink">Stock movement — last 7 days</h2>
              <p className="text-xs text-muted">Units received vs. dispensed across all categories</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={stockMovementSeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E5C51" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0E5C51" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D98C2B" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D98C2B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E4EBE8" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#5B6D67" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#5B6D67" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #DCE6E1" }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="inbound" name="Inbound" stroke="#0E5C51" fill="url(#inbound)" strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" name="Dispensed" stroke="#D98C2B" fill="url(#outbound)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
          <h2 className="font-display text-sm font-semibold text-ink">Batch health</h2>
          <p className="text-xs text-muted">By expiry window, all active batches</p>
          <div className="relative mt-2 grid place-items-center">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3} strokeWidth={0}>
                  {pieData.map((entry) => (
                    <Cell key={entry.key} fill={PIE_COLORS[entry.key]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute text-center">
              <p className="font-display text-xl font-semibold text-ink">{medicines.length}</p>
              <p className="text-[11px] text-muted">batches</p>
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            {pieData.map((d) => (
              <div key={d.key} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[d.key] }} />
                  {d.name}
                </span>
                <span className="font-mono font-medium text-ink">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Expiry watchlist</h2>
            <Link to="/app/expiry" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="pb-2 font-medium">Medicine</th>
                  <th className="pb-2 font-medium">Batch</th>
                  <th className="pb-2 font-medium">Supplier</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((m) => {
                  const status = expiryStatus(m.expiryDate);
                  return (
                    <tr key={m.id} className="border-b border-line/70 last:border-0">
                      <td className="py-2.5 font-medium text-ink">{m.name}</td>
                      <td className="py-2.5 font-mono text-xs text-muted">{m.batchNumber}</td>
                      <td className="py-2.5 text-muted">{supplierName(m.supplierId)}</td>
                      <td className="py-2.5">
                        <StatusPill status={status.key} label={status.key === "expired" ? "Expired" : status.label} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
          <h2 className="font-display text-sm font-semibold text-ink">Recent purchase orders</h2>
          <ul className="mt-3 space-y-3">
            {orders.map((po) => (
              <li key={po.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-mono text-xs font-medium text-ink">{po.id}</p>
                  <p className="text-xs text-muted">{supplierName(po.supplierId)} · {formatDate(po.date)}</p>
                </div>
                <span className="rounded-full bg-bg px-2 py-1 text-[11px] font-medium text-muted">{po.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
