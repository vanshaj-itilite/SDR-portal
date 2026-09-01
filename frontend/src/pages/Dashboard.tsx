import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Phone, Mail, Calendar, Users, Target, Megaphone, ChevronRight } from "lucide-react";
import { useSDR } from "../context/SDRContext";
import { CAMPAIGNS, getCampaignStats } from "../data/campaigns";
import { SDRS, type SDR } from "../data/sdrs";
import "./Dashboard.css";

const STATUS_COLOR: Record<string, string> = {
  New: "blue", Contacted: "purple", Qualified: "green",
  Nurturing: "orange", "Proposal Sent": "teal", Lost: "red",
};

const TYPE_COLOR: Record<string, string> = {
  "Multi-channel": "purple", "Email Sequence": "blue",
  "Cold Call": "green", "LinkedIn": "teal",
};

/* ─── helpers ─────────────────────────────────────────── */
function aggregateStats(sdrs: SDR[]) {
  return sdrs.reduce(
    (acc, s) => ({
      leadsThisMonth: acc.leadsThisMonth + s.stats.leadsThisMonth,
      callsMade:      acc.callsMade      + s.stats.callsMade,
      emailsSent:     acc.emailsSent     + s.stats.emailsSent,
      meetingsBooked: acc.meetingsBooked + s.stats.meetingsBooked,
      quotaAttained:  Math.round((acc.quotaAttained + s.stats.quotaAttained) / 2),
      pipelineValue:  "",
    }),
    { leadsThisMonth: 0, callsMade: 0, emailsSent: 0, meetingsBooked: 0, quotaAttained: 0, pipelineValue: "" }
  );
}

/* ─── component ───────────────────────────────────────── */
export default function Dashboard() {
  const { allSdrs } = useSDR();
  const navigate = useNavigate();

  // SDR filter: "all" or an sdr id
  const [sdrFilter, setSdrFilter] = useState<"all" | string>("all");

  const teamSdrs = SDRS.filter((s) => s.role !== "Manager");
  const selectedSdr = sdrFilter === "all" ? null : SDRS.find((s) => s.id === sdrFilter) ?? null;
  const stats = selectedSdr ? selectedSdr.stats : aggregateStats(teamSdrs);

  // Campaigns visible for this filter
  const visibleCampaigns = sdrFilter === "all"
    ? CAMPAIGNS
    : CAMPAIGNS.filter((c) => c.assignedSdrIds.includes(sdrFilter));

  const KPI_CARDS = [
    { label: "Leads This Month",  value: stats.leadsThisMonth,            icon: Users,      color: "blue"   },
    { label: "Calls Made",        value: stats.callsMade,                  icon: Phone,      color: "green"  },
    { label: "Emails Sent",       value: stats.emailsSent,                 icon: Mail,       color: "purple" },
    { label: "Meetings Booked",   value: stats.meetingsBooked,             icon: Calendar,   color: "orange" },
    { label: "Avg Quota",         value: `${stats.quotaAttained}%`,        icon: Target,     color: "red"    },
    { label: "Pipeline Value",    value: selectedSdr?.stats.pipelineValue ?? "₹57.2L", icon: TrendingUp, color: "teal" },
  ];

  return (
    <div className="dashboard">

      {/* ── SDR Filter ── */}
      <div className="sdr-filter-bar">
        <button
          className={`sdr-chip ${sdrFilter === "all" ? "active" : ""}`}
          onClick={() => setSdrFilter("all")}
        >
          All SDRs
        </button>
        {teamSdrs.map((s) => (
          <button
            key={s.id}
            className={`sdr-chip ${sdrFilter === s.id ? "active" : ""}`}
            onClick={() => setSdrFilter(s.id)}
          >
            <span className="chip-avatar">{s.initials}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* ── KPI Stats ── */}
      <div className="stats-grid">
        {KPI_CARDS.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-icon"><s.icon size={18} /></div>
            <div className="stat-body">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-delta">
                {sdrFilter === "all" ? "Team total" : selectedSdr?.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Campaign Analytics ── */}
      <div className="card">
        <div className="card-header">
          <h2><Megaphone size={14} className="inline-icon" /> Campaign Analytics</h2>
          <button className="card-link-btn" onClick={() => navigate("/campaigns")}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Type</th>
              <th>SDRs</th>
              <th>Enrolled</th>
              <th>Responded</th>
              <th>Converted</th>
              <th>Response Rate</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {visibleCampaigns.map((c) => {
              const s = getCampaignStats(c);
              const rr = s.totalEnrolled
                ? Math.round(((s.responded + s.converted) / s.totalEnrolled) * 100)
                : 0;
              const myEnrolled = selectedSdr
                ? c.enrolledLeads.filter((l) => l.sdrId === selectedSdr.id).length
                : s.totalEnrolled;
              const assignedSdrs = allSdrs.filter((sd) => c.assignedSdrIds.includes(sd.id));

              return (
                <tr
                  key={c.id}
                  className="analytics-row"
                  onClick={() => navigate(`/campaigns/${c.id}`)}
                >
                  <td>
                    <div className="camp-name-cell">
                      <span className={`camp-dot camp-dot-${TYPE_COLOR[c.type]}`} />
                      <span className="camp-name">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`type-tag type-${TYPE_COLOR[c.type]}`}>{c.type}</span>
                  </td>
                  <td>
                    <div className="micro-avatars">
                      {assignedSdrs.map((sd) => (
                        <div
                          key={sd.id}
                          className={`micro-av ${selectedSdr?.id === sd.id ? "micro-av-active" : ""}`}
                          title={sd.name}
                        >
                          {sd.initials}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="num">{selectedSdr ? myEnrolled : s.totalEnrolled}</td>
                  <td className="num">{s.responded}</td>
                  <td className="num">{s.converted}</td>
                  <td>
                    <span className={`rr-val ${rr >= 30 ? "good" : rr >= 15 ? "ok" : "low"}`}>
                      {rr}%
                    </span>
                  </td>
                  <td>
                    <div className="prog-wrap">
                      <div className="prog-bg">
                        <div
                          className={`prog-fill ${rr >= 30 ? "prog-good" : rr >= 15 ? "prog-ok" : "prog-low"}`}
                          style={{ width: `${Math.min(rr, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visibleCampaigns.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-row">No campaigns for this SDR.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Bottom section: team table OR individual detail ── */}
      {sdrFilter === "all" ? (
        <TeamTable sdrs={teamSdrs} onSelect={(id) => setSdrFilter(id)} />
      ) : selectedSdr ? (
        <IndividualDetail sdr={selectedSdr} />
      ) : null}
    </div>
  );
}

/* ─── Team comparison table ──────────────────────────── */
function TeamTable({ sdrs, onSelect }: { sdrs: SDR[]; onSelect: (id: string) => void }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2><Users size={14} className="inline-icon" /> SDR Performance</h2>
      </div>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>SDR</th>
            <th>Leads</th>
            <th>Calls</th>
            <th>Emails</th>
            <th>Meetings</th>
            <th>Quota</th>
            <th>Pipeline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sdrs.map((s) => (
            <tr key={s.id} className="analytics-row" onClick={() => onSelect(s.id)}>
              <td>
                <div className="sdr-name-cell">
                  <div className="sdr-av">{s.initials}</div>
                  <div>
                    <div className="sdr-fullname">{s.name}</div>
                    <div className="sdr-role-label">{s.role}</div>
                  </div>
                </div>
              </td>
              <td className="num">{s.stats.leadsThisMonth}</td>
              <td className="num">{s.stats.callsMade}</td>
              <td className="num">{s.stats.emailsSent}</td>
              <td className="num">{s.stats.meetingsBooked}</td>
              <td>
                <div className="quota-cell">
                  <div className="quota-bg">
                    <div
                      className={`quota-fill ${s.stats.quotaAttained >= 80 ? "prog-good" : s.stats.quotaAttained >= 60 ? "prog-ok" : "prog-low"}`}
                      style={{ width: `${s.stats.quotaAttained}%` }}
                    />
                  </div>
                  <span className="quota-num">{s.stats.quotaAttained}%</span>
                </div>
              </td>
              <td className="num">{s.stats.pipelineValue}</td>
              <td>
                <ChevronRight size={14} className="row-arrow" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Individual SDR detail ──────────────────────────── */
function IndividualDetail({ sdr }: { sdr: SDR }) {
  const navigate = useNavigate();
  const recentLeads = sdr.leads.slice(0, 5);
  const todayTasks  = sdr.tasks.filter((t) => t.dueDate === "Today");
  const myCampaigns = CAMPAIGNS.filter((c) => c.assignedSdrIds.includes(sdr.id));

  return (
    <>
      {/* Campaign participation for this SDR */}
      {myCampaigns.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Campaign Participation — {sdr.name}</h2>
          </div>
          <div className="camp-participation">
            {myCampaigns.map((c) => {
              const myLeads   = c.enrolledLeads.filter((l) => l.sdrId === sdr.id);
              const responded = myLeads.filter((l) => l.status === "Responded" || l.status === "Converted").length;
              const rr        = myLeads.length ? Math.round((responded / myLeads.length) * 100) : 0;
              return (
                <div key={c.id} className="participation-row" onClick={() => navigate(`/campaigns/${c.id}`)}>
                  <span className={`camp-dot camp-dot-${TYPE_COLOR[c.type]}`} />
                  <div className="participation-info">
                    <span className="participation-name">{c.name}</span>
                    <span className="participation-type">{c.type}</span>
                  </div>
                  <div className="participation-stats">
                    <div className="ps"><span className="ps-val">{myLeads.length}</span><span className="ps-label">Leads</span></div>
                    <div className="ps"><span className="ps-val">{responded}</span><span className="ps-label">Responded</span></div>
                    <div className="ps">
                      <span className={`ps-val ${rr >= 30 ? "good" : rr >= 15 ? "ok" : "low"}`}>{rr}%</span>
                      <span className="ps-label">Rate</span>
                    </div>
                  </div>
                  <div className="prog-wrap" style={{ width: 80 }}>
                    <div className="prog-bg">
                      <div
                        className={`prog-fill ${rr >= 30 ? "prog-good" : rr >= 15 ? "prog-ok" : "prog-low"}`}
                        style={{ width: `${Math.min(rr, 100)}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight size={14} className="row-arrow" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent Leads</h2>
          </div>
          {recentLeads.length === 0 ? (
            <p className="empty-msg">No leads yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th><th>Company</th><th>Status</th><th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td className="td-name">{l.name}</td>
                    <td>{l.company}</td>
                    <td><span className={`pill pill-${STATUS_COLOR[l.status]}`}>{l.status}</span></td>
                    <td className="td-muted">{l.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Today's Tasks</h2>
          </div>
          {todayTasks.length === 0 ? (
            <p className="empty-msg">No tasks for today.</p>
          ) : (
            <ul className="task-list">
              {todayTasks.map((t) => (
                <li key={t.id} className={`task-item ${t.done ? "task-done" : ""}`}>
                  <span className={`task-check ${t.done ? "task-check-done" : ""}`}>{t.done && "✓"}</span>
                  <span>{t.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
