import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `block border-l-2 px-4 py-2.5 text-sm font-semibold transition ${
    isActive ? 'border-[#d86b4c] bg-[#e2f1eb] text-[#153d38]' : 'border-transparent text-gray-600 hover:border-[#b7d8ca] hover:bg-[#f2f8f5]'
  }`

export default function Sidebar() {
  const { user, hasRole } = useAuth()

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#dce8e2] bg-[#fbfdfb] p-5 md:block">
      <div className="mb-10 px-2">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#153d38] text-sm font-bold text-white">M</span>
          <h1 className="text-xl font-bold tracking-tight text-[#153d38]">MediStock</h1>
        </div>
        <p className="eyebrow">Inventory intelligence</p>
      </div>
      <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Workspace</p>
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/medicines" className={linkClass}>Medicines</NavLink>
        <NavLink to="/suppliers" className={linkClass}>Suppliers</NavLink>
        <NavLink to="/categories" className={linkClass}>Categories</NavLink>
        {hasRole('ADMIN', 'PHARMACIST') && (
          <NavLink to="/purchase-orders" className={linkClass}>Purchase Orders</NavLink>
        )}
        <NavLink to="/alerts" className={linkClass}>Alerts</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
        {hasRole('ADMIN', 'PHARMACIST') && (
          <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        )}
        {hasRole('ADMIN') && (
          <NavLink to="/users" className={linkClass}>Users</NavLink>
        )}
      </nav>
      <div className="mt-10 border-t border-[#dce8e2] px-2 pt-5 text-xs text-gray-400">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Signed in as</span>
        <div className="mt-1 font-semibold text-[#153d38]">{user?.fullName}</div>
        <div className="mt-1 font-bold uppercase tracking-wide text-[#d86b4c]">{user?.role}</div>
      </div>
    </aside>
  )
}
