import { TrendingUp, Phone, Mail, Calendar, Users, Target } from "lucide-react";
import "./Dashboard.css";

const STATS = [
  { label: "Leads This Month", value: "47", delta: "+12%", icon: Users, color: "blue" },
  { label: "Calls Made", value: "183", delta: "+8%", icon: Phone, color: "green" },
  { label: "Emails Sent", value: "412", delta: "+21%", icon: Mail, color: "purple" },
  { label: "Meetings Booked", value: "14", delta: "+3", icon: Calendar, color: "orange" },
  { label: "Quota Attained", value: "74%", delta: "Target: 100%", icon: Target, color: "red" },
  { label: "Pipeline Value", value: "₹18.4L", delta: "+₹2.1L", icon: TrendingUp, color: "teal" },
];

const RECENT_LEADS = [
  { name: "Arjun Mehta", company: "InfraCloud", status: "Contacted", date: "Today" },
  { name: "Priya Nair", company: "FinEdge", status: "Qualified", date: "Today" },
  { name: "Rahul Sharma", company: "BuildBridge", status: "New", date: "Yesterday" },
  { name: "Sneha Kapoor", company: "LogiCore", status: "Nurturing", date: "Yesterday" },
  { name: "Deepak Joshi", company: "TechVault", status: "Proposal Sent", date: "Aug 29" },
];

const STATUS_COLOR: Record<string, string> = {
  New: "blue",
  Contacted: "purple",
  Qualified: "green",
  Nurturing: "orange",
  "Proposal Sent": "teal",
};

const TASKS_TODAY = [
  { text: "Follow up with Arjun Mehta (InfraCloud)", done: true },
  { text: "Send demo recording to Priya Nair", done: false },
  { text: "Cold call 10 new leads from segment A", done: false },
  { text: "Update pipeline in CRM", done: false },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon">
              <s.icon size={18} />
            </div>
            <div className="stat-body">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-delta">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent Leads</h2>
            <a href="/leads" className="card-link">View all</a>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_LEADS.map((l) => (
                <tr key={l.name}>
                  <td className="td-name">{l.name}</td>
                  <td>{l.company}</td>
                  <td>
                    <span className={`pill pill-${STATUS_COLOR[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="td-muted">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Today's Tasks</h2>
            <a href="/tasks" className="card-link">View all</a>
          </div>
          <ul className="task-list">
            {TASKS_TODAY.map((t) => (
              <li key={t.text} className={`task-item ${t.done ? "task-done" : ""}`}>
                <span className={`task-check ${t.done ? "task-check-done" : ""}`}>
                  {t.done && "✓"}
                </span>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
