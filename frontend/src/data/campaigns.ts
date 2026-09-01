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
  leadId: number;
  leadName: string;
  company: string;
  sdrId: string;
  currentStep: number;
  status: LeadCampaignStatus;
  lastTouched: string;
};

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  goal: string;
  startDate: string;
  endDate: string;
  assignedSdrIds: string[];
  sequence: CampaignStep[];
  enrolledLeads: CampaignLead[];
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Intent",
    type: "Multi-channel",
    status: "Active",
    goal: "Target in-market accounts showing buying intent signals — book 20 discovery calls",
    startDate: "Aug 1, 2026",
    endDate: "Sep 30, 2026",
    assignedSdrIds: ["vanshaj", "aisha"],
    sequence: [
      { step: 1, type: "Email",    label: "Intent trigger intro email",   day: "Day 1"  },
      { step: 2, type: "LinkedIn", label: "LinkedIn connection",          day: "Day 2"  },
      { step: 3, type: "Email",    label: "Follow-up + value prop",       day: "Day 4"  },
      { step: 4, type: "Call",     label: "Discovery call attempt",       day: "Day 6"  },
      { step: 5, type: "Email",    label: "Case study share",             day: "Day 9"  },
      { step: 6, type: "Call",     label: "Final call attempt",           day: "Day 12" },
      { step: 7, type: "Email",    label: "Break-up email",               day: "Day 16" },
    ],
    enrolledLeads: [
      { leadId: 1,   leadName: "Arjun Mehta",   company: "InfraCloud", sdrId: "vanshaj", currentStep: 4, status: "Active",    lastTouched: "Today"     },
      { leadId: 2,   leadName: "Priya Nair",     company: "FinEdge",    sdrId: "vanshaj", currentStep: 5, status: "Responded", lastTouched: "Today"     },
      { leadId: 6,   leadName: "Meera Iyer",     company: "Nexify",     sdrId: "vanshaj", currentStep: 2, status: "Active",    lastTouched: "Aug 28"    },
      { leadId: 101, leadName: "Vivek Malhotra", company: "CloudNine",  sdrId: "aisha",   currentStep: 6, status: "Responded", lastTouched: "Today"     },
      { leadId: 103, leadName: "Nikhil Bose",    company: "DataBridge", sdrId: "aisha",   currentStep: 3, status: "Active",    lastTouched: "Yesterday" },
      { leadId: 105, leadName: "Akash Gupta",    company: "PayFast",    sdrId: "aisha",   currentStep: 1, status: "Active",    lastTouched: "Aug 28"    },
    ],
  },
  {
    id: "c2",
    name: "Job Posts",
    type: "Cold Call",
    status: "Active",
    goal: "Reach out to companies with active travel-related job postings as buying intent signal",
    startDate: "Aug 15, 2026",
    endDate: "Sep 15, 2026",
    assignedSdrIds: ["vanshaj", "rohit"],
    sequence: [
      { step: 1, type: "Call",  label: "Initial cold call",          day: "Day 1" },
      { step: 2, type: "Email", label: "Voicemail + job post hook",  day: "Day 1" },
      { step: 3, type: "Call",  label: "Second call attempt",        day: "Day 3" },
      { step: 4, type: "Email", label: "ROI stats email",            day: "Day 5" },
      { step: 5, type: "Call",  label: "Decision-maker call",        day: "Day 8" },
    ],
    enrolledLeads: [
      { leadId: 4,   leadName: "Sneha Kapoor", company: "LogiCore",   sdrId: "vanshaj", currentStep: 3, status: "Active",    lastTouched: "Aug 29"    },
      { leadId: 5,   leadName: "Deepak Joshi", company: "TechVault",  sdrId: "vanshaj", currentStep: 5, status: "Responded", lastTouched: "Aug 29"    },
      { leadId: 8,   leadName: "Ananya Roy",   company: "PulseHR",    sdrId: "vanshaj", currentStep: 2, status: "Active",    lastTouched: "Aug 26"    },
      { leadId: 201, leadName: "Gaurav Jain",  company: "TravelTech", sdrId: "rohit",   currentStep: 1, status: "Active",    lastTouched: "Today"     },
      { leadId: 205, leadName: "Harish Rao",   company: "SupplyLink", sdrId: "rohit",   currentStep: 4, status: "Responded", lastTouched: "Aug 27"    },
      { leadId: 202, leadName: "Pooja Sharma", company: "RetailX",    sdrId: "rohit",   currentStep: 2, status: "Active",    lastTouched: "Yesterday" },
    ],
  },
  {
    id: "c3",
    name: "Job Change",
    type: "LinkedIn",
    status: "Active",
    goal: "Engage decision-makers who recently changed roles — high propensity to buy in first 90 days",
    startDate: "Aug 10, 2026",
    endDate: "Sep 10, 2026",
    assignedSdrIds: ["aisha"],
    sequence: [
      { step: 1, type: "LinkedIn", label: "Congrats on new role message", day: "Day 1" },
      { step: 2, type: "LinkedIn", label: "Value message + quick win",    day: "Day 3" },
      { step: 3, type: "Email",    label: "Move to email outreach",       day: "Day 6" },
      { step: 4, type: "Call",     label: "Intro call",                   day: "Day 9" },
    ],
    enrolledLeads: [
      { leadId: 102, leadName: "Sanya Patel", company: "HRify",     sdrId: "aisha", currentStep: 4, status: "Converted", lastTouched: "Today"  },
      { leadId: 104, leadName: "Tara Singh",  company: "FleetEdge", sdrId: "aisha", currentStep: 3, status: "Responded", lastTouched: "Aug 29" },
      { leadId: 106, leadName: "Isha Menon",  company: "GrowStack", sdrId: "aisha", currentStep: 2, status: "Active",    lastTouched: "Aug 27" },
    ],
  },
  {
    id: "c4",
    name: "Events",
    type: "Email Sequence",
    status: "Active",
    goal: "Follow up with contacts from industry events and conferences attended in Q3",
    startDate: "Jul 20, 2026",
    endDate: "Aug 31, 2026",
    assignedSdrIds: ["rohit"],
    sequence: [
      { step: 1, type: "Email", label: "Great meeting you at [event]", day: "Day 1"  },
      { step: 2, type: "Email", label: "Relevant resource share",      day: "Day 4"  },
      { step: 3, type: "Call",  label: "Personal follow-up call",      day: "Day 7"  },
      { step: 4, type: "Email", label: "Customer story + CTA",         day: "Day 12" },
    ],
    enrolledLeads: [
      { leadId: 203, leadName: "Sameer Khan", company: "UrbanMove", sdrId: "rohit", currentStep: 2, status: "Active",   lastTouched: "Aug 29" },
      { leadId: 204, leadName: "Divya Nair",  company: "EduCore",   sdrId: "rohit", currentStep: 1, status: "Bounced",  lastTouched: "Aug 28" },
    ],
  },
  {
    id: "c5",
    name: "Nurture",
    type: "Email Sequence",
    status: "Active",
    goal: "Keep warm leads engaged over a longer cycle with value-driven touchpoints until they're ready to buy",
    startDate: "Sep 1, 2026",
    endDate: "Nov 30, 2026",
    assignedSdrIds: ["aisha", "rohit"],
    sequence: [
      { step: 1, type: "Email", label: "Monthly newsletter / insight",  day: "Day 1"  },
      { step: 2, type: "Email", label: "Product update highlight",      day: "Day 14" },
      { step: 3, type: "LinkedIn", label: "LinkedIn check-in",          day: "Day 21" },
      { step: 4, type: "Email", label: "Case study + soft CTA",         day: "Day 30" },
      { step: 5, type: "Call",  label: "Quarterly check-in call",       day: "Day 45" },
    ],
    enrolledLeads: [],
  },
];

export function getCampaignStats(campaign: Campaign) {
  const leads = campaign.enrolledLeads;
  return {
    totalEnrolled: leads.length,
    active:        leads.filter((l) => l.status === "Active").length,
    responded:     leads.filter((l) => l.status === "Responded").length,
    converted:     leads.filter((l) => l.status === "Converted").length,
    unsubscribed:  leads.filter((l) => l.status === "Unsubscribed" || l.status === "Bounced").length,
  };
}

export function getCampaignsForSdr(sdrId: string) {
  return CAMPAIGNS.filter((c) => c.assignedSdrIds.includes(sdrId));
}
