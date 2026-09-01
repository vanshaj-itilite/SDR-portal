import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Users, ChevronRight, UserPlus, Check, Plus, X, Link2, Upload, FileText, Loader2 } from "lucide-react";
import { useSDR } from "../context/SDRContext";
import { useCampaigns, useCreateCampaign } from "../hooks/useCampaigns";
import type { Campaign, CampaignType } from "../types/campaign";
import "./Campaigns.css";

const LEAD_SOURCES = ["LinkedIn", "Referral", "Cold Outreach", "Conference", "Website"];
const CAMPAIGN_TYPES: CampaignType[] = ["Multi-channel", "Email Sequence", "Cold Call", "LinkedIn"];

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
  const [showNewModal, setShowNewModal] = useState(false);
  const navigate = useNavigate();

  const { data: campaigns = [], isLoading, isError } = useCampaigns();

  const visible = filter === "Assigned"
    ? campaigns.filter((c) => c.assigned_sdr_ids.includes(activeSdr.id))
    : campaigns;

  const assignedCount = campaigns.filter((c) => c.assigned_sdr_ids.includes(activeSdr.id)).length;

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
        <button className="new-campaign-btn" onClick={() => setShowNewModal(true)}>
          <Plus size={15} /> Start New Campaign
        </button>
      </div>

      <div className="campaigns-list">
        {isLoading && <div className="empty-card">Loading campaigns…</div>}
        {isError && <div className="empty-card">Couldn't load campaigns. Is the backend running?</div>}
        {!isLoading && !isError && visible.map((c) => {
          const isAssigned = c.assigned_sdr_ids.includes(activeSdr.id);
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
        {!isLoading && !isError && visible.length === 0 && (
          <div className="empty-card">No campaigns found.</div>
        )}
      </div>

      {showNewModal && (
        <NewCampaignModal
          allSdrs={allSdrs}
          onClose={() => setShowNewModal(false)}
          onCreated={() => setShowNewModal(false)}
        />
      )}
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
  const stats = campaign.stats;
  const assignedSdrs = allSdrs.filter((s) => campaign.assigned_sdr_ids.includes(s.id));
  const myLeads = campaign.enrolled_leads.filter((l) => l.sdr_id === activeSdrId).length;
  const responseRate = stats.total_enrolled
    ? Math.round(((stats.responded + stats.converted) / stats.total_enrolled) * 100)
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
            <span>{campaign.start_date} → {campaign.end_date}</span>
          </div>
          <div className="campaign-goal">{campaign.goal}</div>
        </div>
      </div>

      <div className="campaign-row-stats">
        <div className="camp-stat">
          <span className="camp-stat-val">{stats.total_enrolled}</span>
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

function NewCampaignModal({
  allSdrs,
  onClose,
  onCreated,
}: {
  allSdrs: ReturnType<typeof useSDR>["allSdrs"];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("Multi-channel");
  const [goal, setGoal] = useState("");
  const [selectedSdrIds, setSelectedSdrIds] = useState<Set<string>>(new Set());
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [listMode, setListMode] = useState<"upload" | "link">("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [listLink, setListLink] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createCampaign = useCreateCampaign();

  const toggleSdr = (id: string) => {
    setSelectedSdrIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      next.has(source) ? next.delete(source) : next.add(source);
      return next;
    });
  };

  const canSubmit =
    name.trim().length > 0 &&
    selectedSdrIds.size > 0 &&
    selectedSources.size > 0 &&
    (listMode === "upload" ? !!fileName : listLink.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSuccessMessage(null);
    createCampaign.mutate(
      {
        name: name.trim(),
        type,
        goal: goal.trim(),
        assigned_sdr_ids: [...selectedSdrIds],
        lead_sources: [...selectedSources],
        lead_list_mode: listMode,
        lead_list_value: listMode === "upload" ? fileName ?? "" : listLink.trim(),
      },
      {
        onSuccess: (campaign) => {
          setSuccessMessage(`Created — ${campaign.enrolled_leads.length} leads imported.`);
          setTimeout(onCreated, 900);
        },
      }
    );
  };

  const errorMessage =
    createCampaign.isError &&
    ((createCampaign.error as any)?.response?.data?.detail ?? "Couldn't create the campaign. Please try again.");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Start New Campaign</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Campaign name</label>
            <input
              type="text"
              placeholder="e.g. Q4 Outbound Push"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Campaign type</label>
            <div className="chip-row">
              {CAMPAIGN_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${type === t ? "chip-active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label>Assign SDRs</label>
            <div className="sdr-select-row">
              {allSdrs.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`sdr-chip ${selectedSdrIds.has(s.id) ? "sdr-chip-active" : ""}`}
                  onClick={() => toggleSdr(s.id)}
                >
                  <span className="mini-avatar">{s.initials}</span>
                  {s.name}
                  {selectedSdrIds.has(s.id) && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label>Lead sources</label>
            <div className="chip-row">
              {LEAD_SOURCES.map((src) => (
                <button
                  type="button"
                  key={src}
                  className={`chip ${selectedSources.has(src) ? "chip-active" : ""}`}
                  onClick={() => toggleSource(src)}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-field">
            <label>Lead list</label>
            <div className="filter-tabs list-mode-tabs">
              <button
                type="button"
                className={`filter-tab ${listMode === "upload" ? "active" : ""}`}
                onClick={() => setListMode("upload")}
              >
                <Upload size={13} /> Upload file
              </button>
              <button
                type="button"
                className={`filter-tab ${listMode === "link" ? "active" : ""}`}
                onClick={() => setListMode("link")}
              >
                <Link2 size={13} /> Paste link
              </button>
            </div>

            {listMode === "upload" ? (
              <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  hidden
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
                {fileName ? (
                  <div className="upload-box-file">
                    <FileText size={16} />
                    <span>{fileName}</span>
                  </div>
                ) : (
                  <div className="upload-box-empty">
                    <Upload size={18} />
                    <span>Click to upload CSV or Excel file</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/..."
                  value={listLink}
                  onChange={(e) => setListLink(e.target.value)}
                />
                <p className="modal-hint">
                  Leads are imported from this Google Sheet using your signed-in Google account —
                  make sure it has access to the sheet.
                </p>
              </>
            )}
          </div>

          <div className="modal-field">
            <label>Goal (optional)</label>
            <input
              type="text"
              placeholder="e.g. Book 20 discovery calls"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          {errorMessage && <p className="modal-error">{errorMessage}</p>}
          {successMessage && <p className="modal-success">{successMessage}</p>}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="modal-btn-primary"
            disabled={!canSubmit || createCampaign.isPending}
            onClick={handleSubmit}
          >
            {createCampaign.isPending ? (
              <><Loader2 size={14} className="spin" /> Creating…</>
            ) : (
              "Create Campaign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
