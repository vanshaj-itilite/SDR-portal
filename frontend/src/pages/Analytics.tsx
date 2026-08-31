import "./Analytics.css";

const WEEKLY_ACTIVITY = [
  { day: "Mon", calls: 38, emails: 72 },
  { day: "Tue", calls: 42, emails: 85 },
  { day: "Wed", calls: 29, emails: 60 },
  { day: "Thu", calls: 45, emails: 90 },
  { day: "Fri", calls: 29, emails: 56 },
];

const MAX_CALLS = Math.max(...WEEKLY_ACTIVITY.map((d) => d.calls));
const MAX_EMAILS = Math.max(...WEEKLY_ACTIVITY.map((d) => d.emails));

const FUNNEL = [
  { label: "Total Leads", value: 47, pct: 100, color: "#2563eb" },
  { label: "Contacted", value: 38, pct: 81, color: "#7c3aed" },
  { label: "Qualified", value: 22, pct: 47, color: "#0d9488" },
  { label: "Proposal Sent", value: 14, pct: 30, color: "#d97706" },
  { label: "Meetings Booked", value: 14, pct: 30, color: "#16a34a" },
];

const CONV_STATS = [
  { label: "Lead → Contact Rate", value: "80.9%", delta: "+4.2%" },
  { label: "Contact → Qualify Rate", value: "57.9%", delta: "+1.8%" },
  { label: "Qualify → Proposal Rate", value: "63.6%", delta: "-2.1%" },
  { label: "Avg. Response Time", value: "3.2h", delta: "-0.5h" },
];

export default function Analytics() {
  return (
    <div className="analytics-page">
      {/* Conversion stats row */}
      <div className="conv-row">
        {CONV_STATS.map((s) => (
          <div key={s.label} className="conv-card">
            <span className="conv-value">{s.value}</span>
            <span className="conv-label">{s.label}</span>
            <span className={`conv-delta ${s.delta.startsWith("-") ? "neg" : "pos"}`}>{s.delta} vs last month</span>
          </div>
        ))}
      </div>

      <div className="charts-row">
        {/* Activity bar chart */}
        <div className="card">
          <div className="card-header">
            <h2>Weekly Activity</h2>
            <span className="legend">
              <span className="dot dot-blue" /> Calls
              <span className="dot dot-purple" /> Emails
            </span>
          </div>
          <div className="bar-chart">
            {WEEKLY_ACTIVITY.map((d) => (
              <div key={d.day} className="bar-group">
                <div className="bars">
                  <div
                    className="bar bar-blue"
                    style={{ height: `${(d.calls / MAX_CALLS) * 100}%` }}
                    title={`Calls: ${d.calls}`}
                  />
                  <div
                    className="bar bar-purple"
                    style={{ height: `${(d.emails / MAX_EMAILS) * 100}%` }}
                    title={`Emails: ${d.emails}`}
                  />
                </div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="card">
          <div className="card-header">
            <h2>Lead Funnel</h2>
          </div>
          <div className="funnel">
            {FUNNEL.map((f) => (
              <div key={f.label} className="funnel-row">
                <span className="funnel-label">{f.label}</span>
                <div className="funnel-bar-wrap">
                  <div
                    className="funnel-bar"
                    style={{ width: `${f.pct}%`, background: f.color }}
                  />
                </div>
                <span className="funnel-val">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
