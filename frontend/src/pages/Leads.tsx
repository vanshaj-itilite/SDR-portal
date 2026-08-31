import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import "./Leads.css";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  owner: string;
  lastActivity: string;
};

const LEADS: Lead[] = [
  { id: 1, name: "Arjun Mehta", company: "InfraCloud", email: "arjun@infracloud.io", phone: "+91 98001 11234", status: "Contacted", source: "LinkedIn", owner: "Vanshaj K.", lastActivity: "Today" },
  { id: 2, name: "Priya Nair", company: "FinEdge", email: "priya.nair@finedge.in", phone: "+91 98002 22345", status: "Qualified", source: "Referral", owner: "Vanshaj K.", lastActivity: "Today" },
  { id: 3, name: "Rahul Sharma", company: "BuildBridge", email: "rahul@buildbridge.com", phone: "+91 98003 33456", status: "New", source: "Cold Outreach", owner: "Vanshaj K.", lastActivity: "Yesterday" },
  { id: 4, name: "Sneha Kapoor", company: "LogiCore", email: "sneha.k@logicore.in", phone: "+91 98004 44567", status: "Nurturing", source: "Conference", owner: "Vanshaj K.", lastActivity: "Aug 29" },
  { id: 5, name: "Deepak Joshi", company: "TechVault", email: "deepak@techvault.io", phone: "+91 98005 55678", status: "Proposal Sent", source: "Website", owner: "Vanshaj K.", lastActivity: "Aug 29" },
  { id: 6, name: "Meera Iyer", company: "Nexify", email: "meera@nexify.com", phone: "+91 98006 66789", status: "New", source: "LinkedIn", owner: "Vanshaj K.", lastActivity: "Aug 28" },
  { id: 7, name: "Karan Desai", company: "SwiftOps", email: "karan@swiftops.in", phone: "+91 98007 77890", status: "Lost", source: "Cold Outreach", owner: "Vanshaj K.", lastActivity: "Aug 27" },
  { id: 8, name: "Ananya Roy", company: "PulseHR", email: "ananya@pulsehr.com", phone: "+91 98008 88901", status: "Contacted", source: "Referral", owner: "Vanshaj K.", lastActivity: "Aug 26" },
];

const STATUS_COLOR: Record<string, string> = {
  New: "blue",
  Contacted: "purple",
  Qualified: "green",
  Nurturing: "orange",
  "Proposal Sent": "teal",
  Lost: "red",
};

const STATUSES = ["All", "New", "Contacted", "Qualified", "Nurturing", "Proposal Sent", "Lost"];

export default function Leads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = LEADS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="leads-page">
      <div className="page-toolbar">
        <div className="search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <Filter size={14} />
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-tab ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="btn-primary">
          <Plus size={15} /> Add Lead
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Source</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="table-row">
                <td className="td-primary">{l.name}</td>
                <td>{l.company}</td>
                <td className="td-muted">{l.email}</td>
                <td className="td-muted">{l.phone}</td>
                <td>
                  <span className={`pill pill-${STATUS_COLOR[l.status]}`}>{l.status}</span>
                </td>
                <td>{l.source}</td>
                <td className="td-muted">{l.lastActivity}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-row">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
