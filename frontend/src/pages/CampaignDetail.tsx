import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Link2, Clock, CheckCircle2 } from "lucide-react";
import { useSDR } from "../context/SDRContext";
import { CAMPAIGNS, getCampaignStats, type CampaignStep, type CampaignLead } from "../data/campaigns";
import "./CampaignDetail.css";

const STEP_COLOR: Record<string, string> = {
  Email:    "blue",
  Call:     "green",
  LinkedIn: "teal",
  Wait:     "gray",
};

const STEP_ICON = {
  Email:    Mail,
  Call:     Phone,
  LinkedIn: Link2,
  Wait:     Clock,
};

const LEAD_STATUS_COLOR: Record<string, string> = {
  Active:       "blue",
  Responded:    "purple",
  Converted:    "green",
  Unsubscribed: "orange",
  Bounced:      "red",
};

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeSdr, allSdrs } = useSDR();

  const campaign = CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) {
    return (
      <div className="cd-not-found">
        <p>Campaign not found.</p>
        <button onClick={() => navigate("/campaigns")} className="btn-back">← Back</button>
      </div>
    );
  }

  const stats = getCampaignStats(campaign);
  const assignedSdrs = allSdrs.filter((s) => campaign.assignedSdrIds.includes(s.id));
  const myLeads = campaign.enrolledLeads.filter((l) => l.sdrId === activeSdr.id);
  const responseRate = stats.totalEnrolled
    ? Math.round(((stats.responded + stats.converted) / stats.totalEnrolled) * 100)
    : 0;

  const STATUS_COLOR_MAP: Record<string, string> = {
    Active:    "green",
    Paused:    "orange",
    Completed: "blue",
    Draft:     "gray",
  };

  return (
    <div className="cd-page">
      {/* Header */}
      <div className="cd-header">
        <button className="btn-back" onClick={() => navigate("/campaigns")}>
          <ArrowLeft size={15} /> Campaigns
        </button>
        <div className="cd-title-row">
          <div>
            <h1 className="cd-title">{campaign.name}</h1>
            <p className="cd-goal">{campaign.goal}</p>
          </div>
          <div className="cd-header-right">
            <span className={`pill pill-${STATUS_COLOR_MAP[campaign.status]}`}>{campaign.status}</span>
            <span className="cd-dates">{campaign.startDate} → {campaign.endDate}</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="cd-stats-bar">
          <div className="cd-stat">
            <span className="cd-stat-val">{stats.totalEnrolled}</span>
            <span className="cd-stat-label">Enrolled</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-val">{stats.active}</span>
            <span className="cd-stat-label">Active</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-val">{stats.responded}</span>
            <span className="cd-stat-label">Responded</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-val">{stats.converted}</span>
            <span className="cd-stat-label">Converted</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className={`cd-stat-val ${responseRate >= 30 ? "good" : responseRate >= 15 ? "ok" : "low"}`}>
              {responseRate}%
            </span>
            <span className="cd-stat-label">Response Rate</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-val">{myLeads.length}</span>
            <span className="cd-stat-label">My Leads</span>
          </div>
        </div>
      </div>

      <div className="cd-body">
        {/* Left: Sequence + SDRs */}
        <div className="cd-sidebar">
          <div className="cd-card">
            <div className="cd-card-title">Sequence ({campaign.sequence.length} steps)</div>
            <div className="sequence">
              {campaign.sequence.map((step, i) => (
                <SequenceStep key={step.step} step={step} isLast={i === campaign.sequence.length - 1} />
              ))}
            </div>
          </div>

          <div className="cd-card">
            <div className="cd-card-title">Assigned SDRs ({assignedSdrs.length})</div>
            <div className="sdr-list">
              {assignedSdrs.map((sdr) => {
                const sdrLeads = campaign.enrolledLeads.filter((l) => l.sdrId === sdr.id);
                const sdrConverted = sdrLeads.filter((l) => l.status === "Converted").length;
                return (
                  <div key={sdr.id} className={`sdr-row ${sdr.id === activeSdr.id ? "sdr-row-me" : ""}`}>
                    <div className="sdr-mini-avatar">{sdr.initials}</div>
                    <div className="sdr-row-info">
                      <span className="sdr-row-name">
                        {sdr.name}
                        {sdr.id === activeSdr.id && <span className="you-badge">you</span>}
                      </span>
                      <span className="sdr-row-sub">{sdr.role}</span>
                    </div>
                    <div className="sdr-row-stats">
                      <span>{sdrLeads.length} leads</span>
                      {sdrConverted > 0 && <span className="converted-count">✓ {sdrConverted}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Leads table */}
        <div className="cd-main">
          <div className="cd-card">
            <div className="cd-card-header">
              <div className="cd-card-title">All Enrolled Leads</div>
              <div className="view-toggle">
                <button className="view-btn active">All ({campaign.enrolledLeads.length})</button>
                <button className="view-btn">Mine ({myLeads.length})</button>
              </div>
            </div>
            {campaign.enrolledLeads.length === 0 ? (
              <p className="cd-empty">No leads enrolled yet.</p>
            ) : (
              <table className="cd-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>SDR</th>
                    <th>Current Step</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Last Touched</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.enrolledLeads.map((lead) => (
                    <LeadRow
                      key={lead.leadId}
                      lead={lead}
                      totalSteps={campaign.sequence.length}
                      allSdrs={allSdrs}
                      activeSdrId={activeSdr.id}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SequenceStep({ step, isLast }: { step: CampaignStep; isLast: boolean }) {
  const Icon = STEP_ICON[step.type];
  return (
    <div className="seq-step">
      <div className="seq-line-wrap">
        <div className={`seq-dot seq-dot-${STEP_COLOR[step.type]}`}>
          <Icon size={12} />
        </div>
        {!isLast && <div className="seq-line" />}
      </div>
      <div className="seq-content">
        <span className="seq-label">{step.label}</span>
        <span className="seq-day">{step.day}</span>
      </div>
    </div>
  );
}

function LeadRow({
  lead,
  totalSteps,
  allSdrs,
  activeSdrId,
}: {
  lead: CampaignLead;
  totalSteps: number;
  allSdrs: ReturnType<typeof useSDR>["allSdrs"];
  activeSdrId: string;
}) {
  const sdr = allSdrs.find((s) => s.id === lead.sdrId);
  const pct = Math.round((lead.currentStep / totalSteps) * 100);
  const isTerminal = lead.status === "Converted" || lead.status === "Unsubscribed" || lead.status === "Bounced";

  return (
    <tr className={`cd-row ${lead.sdrId === activeSdrId ? "cd-row-mine" : ""}`}>
      <td>
        <div className="lead-cell">
          <span className="lead-name">{lead.leadName}</span>
          <span className="lead-company">{lead.company}</span>
        </div>
      </td>
      <td>
        <div className="sdr-cell">
          <div className="micro-avatar">{sdr?.initials}</div>
          <span>{sdr?.name}</span>
        </div>
      </td>
      <td>
        {isTerminal ? (
          <span className="step-done"><CheckCircle2 size={13} /> Done</span>
        ) : (
          <span className="step-num">Step {lead.currentStep} of {totalSteps}</span>
        )}
      </td>
      <td>
        <div className="progress-cell">
          <div className="progress-bg">
            <div
              className={`progress-fill ${isTerminal ? "progress-done" : ""}`}
              style={{ width: `${isTerminal ? 100 : pct}%` }}
            />
          </div>
          <span className="progress-pct">{isTerminal ? "100" : pct}%</span>
        </div>
      </td>
      <td>
        <span className={`pill pill-${LEAD_STATUS_COLOR[lead.status]}`}>{lead.status}</span>
      </td>
      <td className="td-muted">{lead.lastTouched}</td>
    </tr>
  );
}
