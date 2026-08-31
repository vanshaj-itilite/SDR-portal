import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CheckSquare,
  BarChart2,
  Zap,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import "./Layout.css";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/accounts", icon: Building2, label: "Accounts" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/accounts": "Accounts",
  "/tasks": "Tasks",
  "/analytics": "Analytics",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "SDR Portal";

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap size={20} />
          <span>SDR Portal</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className="nav-item">
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">VK</div>
          <div className="sidebar-user">
            <span className="sidebar-user-name">Vanshaj K.</span>
            <span className="sidebar-user-role">SDR</span>
          </div>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="header-right">
            <button className="icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="badge">3</span>
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
