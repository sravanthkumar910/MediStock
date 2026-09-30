import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    ['Dashboard', '/dashboard'],
    ['Medicines', '/medicines'],
    ['Suppliers', '/suppliers'],
    ['Categories', '/categories'],
    ...(hasRole('ADMIN', 'PHARMACIST') ? [['Purchase Orders', '/purchase-orders']] : []),
    ['Alerts', '/alerts'],
    ['Notifications', '/notifications'],
    ...(hasRole('ADMIN', 'PHARMACIST') ? [['Reports', '/reports']] : []),
    ...(hasRole('ADMIN') ? [['Users', '/users']] : []),
  ]

  const currentPage = links.find(([, path]) => location.pathname.startsWith(path))?.[0] || 'Workspace'

  return (
    <header className="flex items-center justify-between border-b border-[#dce8e2] bg-[#fbfdfb] px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(!menuOpen)}
          className="grid h-9 w-9 place-items-center border border-[#dce8e2] text-lg text-[#153d38] focus:outline-none focus:ring-2 focus:ring-[#b7e4d5]"
        >
          {menuOpen ? 'x' : '='}
        </button>
        <div>
          <div className="font-bold tracking-tight text-[#153d38]">MediStock</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{currentPage}</div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden text-xs text-gray-500 sm:inline">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="border border-[#f0c2b5] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#b65239] transition hover:bg-[#fff1ed]"
        >
          Logout
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="absolute left-0 right-0 top-[73px] z-20 border-b border-[#dce8e2] bg-[#fbfdfb] p-3 shadow-lg md:hidden">
          <div className="space-y-1">
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-4 py-3 text-sm font-semibold ${isActive ? 'bg-[#e2f1eb] text-[#153d38]' : 'text-gray-600'}`}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
