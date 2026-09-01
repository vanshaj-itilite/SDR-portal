import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Users, ChevronRight, UserPlus, Check } from "lucide-react";
import { useSDR } from "../context/SDRContext";
import { CAMPAIGNS, getCampaignStats, type Campaign } from "../data/campaigns";
import "./Campaigns.css";

const TYPE_COLOR: Record<string, string> = {
  "Multi-channel":  "purple",
  "Email Sequence": "blue",
  "Cold Call":      "green",
  "LinkedIn":       "teal",
};

const STATUS_COLOR: Record<string, string> = {
  Active:    "green",
  Paused:    "orange",
  Completed: "blue",
  Draft:     "gray",
};

const FILTERS = ["All", "Assigned"];

export default function Campaigns() {
  const { activeSdr, allSdrs } = useSDR();
  const [filter, setFilter] = useState("All");
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const visible = filter === "Assigned"
    ? CAMPAIGNS.filter((c) => c.assignedSdrIds.includes(activeSdr.id))
    : CAMPAIGNS;

  const assignedCount = CAMPAIGNS.filter((c) => c.assignedSdrIds.includes(activeSdr.id)).length;

  const handleRequest = (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    setRequested((prev) => new Set(prev).add(campaignId));
  };

  return (
    <div className="campaigns-page">
      <div className="page-toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "Assigned" && (
                <span className="tab-count">{assignedCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="campaigns-list">
        {visible.map((c) => {
          const isAssigned = c.assignedSdrIds.includes(activeSdr.id);
          const hasRequested = requested.has(c.id);
          return (
            <CampaignRow
              key={c.id}
              campaign={c}
              allSdrs={allSdrs}
              activeSdrId={activeSdr.id}
              isAssigned={isAssigned}
              hasRequested={hasRequested}
              onRequest={(e) => handleRequest(e, c.id)}
              onClick={() => isAssigned && navigate(`/campaigns/${c.id}`)}
            />
          );
        })}
        {visible.length === 0 && (
          <div className="empty-card">No campaigns found.</div>
        )}
      </div>
    </div>
  );
}

function CampaignRow({
  campaign,
  allSdrs,
  activeSdrId,
  isAssigned,
  hasRequested,
  onRequest,
  onClick,
}: {
  campaign: Campaign;
  allSdrs: ReturnType<typeof useSDR>["allSdrs"];
  activeSdrId: string;
  isAssigned: boolean;
  hasRequested: boolean;
  onRequest: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const stats = getCampaignStats(campaign);
  const assignedSdrs = allSdrs.filter((s) => campaign.assignedSdrIds.includes(s.id));
  const myLeads = campaign.enrolledLeads.filter((l) => l.sdrId === activeSdrId).length;
  const responseRate = stats.totalEnrolled
    ? Math.round(((stats.responded + stats.converted) / stats.totalEnrolled) * 100)
    : 0;

  return (
    <div
      className={`campaign-row ${isAssigned ? "campaign-row-assigned" : "campaign-row-unassigned"}`}
      onClick={onClick}
      style={{ cursor: isAssigned ? "pointer" : "default" }}
    >
      <div className="campaign-row-left">
        <div className={`campaign-icon camp-${TYPE_COLOR[campaign.type]}`}>
          <Megaphone size={16} />
        </div>
        <div className="campaign-info">
          <div className="campaign-name">
            {campaign.name}
            <span className={`pill pill-${STATUS_COLOR[campaign.status]}`}>{campaign.status}</span>
            {isAssigned && <span className="pill pill-assigned">Assigned</span>}
          </div>
          <div className="campaign-meta">
            <span className={`type-tag type-${TYPE_COLOR[campaign.type]}`}>{campaign.type}</span>
            <span className="sep">·</span>
            <span>{campaign.sequence.length} steps</span>
            <span className="sep">·</span>
            <span>{campaign.startDate} → {campaign.endDate}</span>
          </div>
          <div className="campaign-goal">{campaign.goal}</div>
        </div>
      </div>

      <div className="campaign-row-stats">
        <div className="camp-stat">
          <span className="camp-stat-val">{stats.totalEnrolled}</span>
          <span className="camp-stat-label">Enrolled</span>
        </div>
        <div className="camp-stat">
          <span className="camp-stat-val">{stats.responded}</span>
          <span className="camp-stat-label">Responded</span>
        </div>
        <div className="camp-stat">
          <span className="camp-stat-val">{stats.converted}</span>
          <span className="camp-stat-label">Converted</span>
        </div>
        <div className="camp-stat">
          <span className={`camp-stat-val ${responseRate >= 30 ? "good" : responseRate >= 15 ? "ok" : "low"}`}>
            {responseRate}%
          </span>
          <span className="camp-stat-label">Response</span>
        </div>
        {isAssigned && (
          <div className="camp-stat">
            <span className="camp-stat-val">{myLeads}</span>
            <span className="camp-stat-label">My Leads</span>
          </div>
        )}
      </div>

      <div className="campaign-row-right">
        <div className="assigned-sdrs">
          <Users size={13} />
          {assignedSdrs.map((s) => (
            <div
              key={s.id}
              className={`mini-avatar ${s.id === activeSdrId ? "mine" : ""}`}
              title={s.name}
            >
              {s.initials}
            </div>
          ))}
        </div>

        {isAssigned ? (
          <ChevronRight size={16} className="row-arrow" />
        ) : (
          <button
            className={`request-btn ${hasRequested ? "request-btn-sent" : ""}`}
            onClick={onRequest}
            disabled={hasRequested}
          >
            {hasRequested ? (
              <><Check size={13} /> Requested</>
            ) : (
              <><UserPlus size={13} /> Request to Join</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
