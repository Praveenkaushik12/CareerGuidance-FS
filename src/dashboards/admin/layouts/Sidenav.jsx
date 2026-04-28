import { Outlet, Link, useLocation } from 'react-router-dom'
import SidenavCSS from '../../../assets/styles/dashboards/admin_css/Sidenav.module.css'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'fas fa-gauge-high',
    to: '/admin/dashboard',
  },
  {
    label: 'Approve',
    icon: 'fa-solid fa-circle-check',
    children: [
      { label: 'Counsellors', icon: 'fa fa-users', to: '/admin/approveCounsellors' },
      { label: 'Blogs', icon: 'fas fa-blog', to: '/admin/approveBlogs' },
      { label: 'Reviews', icon: 'fas fa-comment', to: '/admin/approveReviews' },
    ],
  },
  {
    label: 'Reports',
    icon: 'fas fa-chart-bar',
    children: [
      { label: 'Users', icon: 'fas fa-file-alt', to: '/admin/userReport' },
      { label: 'Counsellors', icon: 'fas fa-file-alt', to: '/admin/counsellorsReport' },
    ],
  },
]

function NavLink({ to, icon, label }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={`${SidenavCSS.navLink} ${active ? SidenavCSS.active : ''}`}
    >
      <i className={`${icon} ${SidenavCSS.navIcon}`}></i>
      <span>{label}</span>
    </Link>
  )
}

function NavGroup({ icon, label, children }) {
  const { pathname } = useLocation()
  const isOpen = children.some(c => pathname === c.to)
  const [open, setOpen] = React.useState(isOpen)

  return (
    <div className={SidenavCSS.group}>
      <button className={SidenavCSS.groupBtn} onClick={() => setOpen(o => !o)}>
        <i className={`${icon} ${SidenavCSS.navIcon}`}></i>
        <span>{label}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} ${SidenavCSS.chevron}`}></i>
      </button>
      {open && (
        <div className={SidenavCSS.groupChildren}>
          {children.map(c => <NavLink key={c.to} {...c} />)}
        </div>
      )}
    </div>
  )
}

import React from 'react'

export default function SidebarNav() {
  return (
    <div className={SidenavCSS.shell}>
      {/* Sidebar */}
      <aside className={SidenavCSS.sidebar}>
        <nav className={SidenavCSS.nav}>
          {NAV_ITEMS.map(item =>
            item.children
              ? <NavGroup key={item.label} {...item} />
              : <NavLink key={item.to} {...item} />
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className={SidenavCSS.content}>
        <Outlet />
      </main>
    </div>
  )
}
