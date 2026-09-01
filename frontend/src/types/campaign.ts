// Mirrors the shape returned by the backend (backend/apis/campaigns.py) —
// snake_case, since that's what actually comes off the wire now.

export type CampaignType = "Email Sequence" | "Cold Call" | "LinkedIn" | "Multi-channel";
export type CampaignStatus = "Active" | "Paused" | "Completed" | "Draft";
export type LeadCampaignStatus = "Active" | "Responded" | "Converted" | "Unsubscribed" | "Bounced";

export type CampaignStep = {
  step: number;
  type: "Email" | "Call" | "LinkedIn" | "Wait";
  label: string;
  day: string;
};

export type CampaignLead = {
  lead_id: number;
  lead_name: string;
  company: string;
  sdr_id: string;
  current_step: number;
  status: LeadCampaignStatus;
  last_touched: string;
};

export type CampaignStats = {
  total_enrolled: number;
  active: number;
  responded: number;
  converted: number;
  unsubscribed: number;
};

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  goal: string;
  start_date: string;
  end_date: string;
  assigned_sdr_ids: string[];
  lead_sources: string[];
  lead_list_mode: "upload" | "link" | null;
  lead_list_value: string | null;
  sequence: CampaignStep[];
  enrolled_leads: CampaignLead[];
  stats: CampaignStats;
};

export type CreateCampaignInput = {
  name: string;
  type: CampaignType;
  goal: string;
  assigned_sdr_ids: string[];
  lead_sources: string[];
  lead_list_mode: "upload" | "link";
  lead_list_value: string;
};
