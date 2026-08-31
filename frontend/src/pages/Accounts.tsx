import { useState } from "react";
import { Plus, Search, Globe, Users } from "lucide-react";
import "./Accounts.css";

type Account = {
  id: number;
  name: string;
  industry: string;
  size: string;
  website: string;
  contacts: number;
  stage: string;
  owner: string;
};

const ACCOUNTS: Account[] = [
  { id: 1, name: "InfraCloud", industry: "Technology", size: "51-200", website: "infracloud.io", contacts: 3, stage: "Active", owner: "Vanshaj K." },
  { id: 2, name: "FinEdge", industry: "Fintech", size: "11-50", website: "finedge.in", contacts: 2, stage: "Prospect", owner: "Vanshaj K." },
  { id: 3, name: "BuildBridge", industry: "Construction Tech", size: "201-500", website: "buildbridge.com", contacts: 1, stage: "New", owner: "Vanshaj K." },
  { id: 4, name: "LogiCore", industry: "Logistics", size: "501-1000", website: "logicore.in", contacts: 4, stage: "Active", owner: "Vanshaj K." },
  { id: 5, name: "TechVault", industry: "SaaS", size: "11-50", website: "techvault.io", contacts: 2, stage: "Proposal", owner: "Vanshaj K." },
  { id: 6, name: "Nexify", industry: "E-commerce", size: "51-200", website: "nexify.com", contacts: 1, stage: "New", owner: "Vanshaj K." },
  { id: 7, name: "SwiftOps", industry: "DevOps", size: "11-50", website: "swiftops.in", contacts: 1, stage: "Churned", owner: "Vanshaj K." },
  { id: 8, name: "PulseHR", industry: "HR Tech", size: "51-200", website: "pulsehr.com", contacts: 2, stage: "Active", owner: "Vanshaj K." },
];

const STAGE_COLOR: Record<string, string> = {
  New: "blue",
  Prospect: "purple",
  Active: "green",
  Proposal: "teal",
  Churned: "red",
};

export default function Accounts() {
  const [search, setSearch] = useState("");

  const filtered = ACCOUNTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="accounts-page">
      <div className="page-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary">
          <Plus size={15} /> Add Account
        </button>
      </div>

      <div className="accounts-grid">
        {filtered.map((a) => (
          <div key={a.id} className="account-card">
            <div className="account-header">
              <div className="account-avatar">{a.name[0]}</div>
              <div>
                <div className="account-name">{a.name}</div>
                <div className="account-industry">{a.industry}</div>
              </div>
              <span className={`pill pill-${STAGE_COLOR[a.stage]} ml-auto`}>{a.stage}</span>
            </div>
            <div className="account-meta">
              <span className="meta-item">
                <Users size={13} /> {a.contacts} contact{a.contacts !== 1 ? "s" : ""}
              </span>
              <span className="meta-item">
                <Users size={13} /> {a.size} employees
              </span>
              <a
                href={`https://${a.website}`}
                target="_blank"
                rel="noreferrer"
                className="meta-item meta-link"
              >
                <Globe size={13} /> {a.website}
              </a>
            </div>
            <div className="account-footer">Owner: {a.owner}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="empty-msg">No accounts found.</p>
        )}
      </div>
    </div>
  );
}
