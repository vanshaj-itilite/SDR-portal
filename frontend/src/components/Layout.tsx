import { useState } from "react";
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
  ChevronDown,
  UsersRound,
  Megaphone,
  LogOut,
} from "lucide-react";
import { useSDR } from "../context/SDRContext";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/leads",     icon: Users,            label: "Leads"      },
  { to: "/campaigns", icon: Megaphone,         label: "Campaigns"  },
  { to: "/accounts",  icon: Building2,         label: "Accounts"   },
  { to: "/tasks",     icon: CheckSquare,       label: "Tasks"      },
  { to: "/analytics", icon: BarChart2,         label: "Analytics"  },
  { to: "/team",      icon: UsersRound,        label: "Team"       },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads":     "Leads",
  "/campaigns": "Campaigns",
  "/accounts":  "Accounts",
  "/tasks":     "Tasks",
  "/analytics": "Analytics",
  "/team":      "Team",
};

export default function Layout() {
  const { pathname } = useLocation();
  const { activeSdr, setActiveSdr, allSdrs } = useSDR();
  const { logout } = useAuth();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Match sub-routes like /campaigns/:id
  const titleKey = Object.keys(PAGE_TITLES).find((k) => pathname === k || pathname.startsWith(k + "/"));
  const title = PAGE_TITLES[titleKey ?? ""] ?? "SDR Portal";

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Zap size={20} />
          <span>SDR Portal</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "nav-item" + (isActive || (to !== "/" && pathname.startsWith(to)) ? " active" : "")
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>

        {/* SDR Switcher */}
        <div className="sidebar-footer">
          <button className="sdr-switcher" onClick={() => setSwitcherOpen((o) => !o)}>
            <div className="avatar">{activeSdr.initials}</div>
            <div className="sidebar-user">
              <span className="sidebar-user-name">{activeSdr.name}</span>
              <span className="sidebar-user-role">{activeSdr.role}</span>
            </div>
            <ChevronDown size={14} className={`switcher-arrow ${switcherOpen ? "open" : ""}`} />
          </button>

          {switcherOpen && (
            <div className="switcher-dropdown">
              <div className="switcher-label">Switch view</div>
              {allSdrs.map((sdr) => (
                <button
                  key={sdr.id}
                  className={`switcher-item ${sdr.id === activeSdr.id ? "active" : ""}`}
                  onClick={() => { setActiveSdr(sdr); setSwitcherOpen(false); }}
                >
                  <div className="switcher-avatar">{sdr.initials}</div>
                  <div>
                    <div className="switcher-name">{sdr.name}</div>
                    <div className="switcher-role">{sdr.role}</div>
                  </div>
                  {sdr.id === activeSdr.id && <span className="switcher-check">✓</span>}
                </button>
              ))}
              <button className="switcher-item switcher-signout" onClick={logout}>
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="main-wrap">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">{title}</h1>
            {activeSdr.role === "Manager" && pathname !== "/team" && (
              <span className="viewing-badge">Viewing as {activeSdr.name}</span>
            )}
          </div>
          <div className="header-right">
            <button className="icon-btn" aria-label="Search"><Search size={18} /></button>
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
