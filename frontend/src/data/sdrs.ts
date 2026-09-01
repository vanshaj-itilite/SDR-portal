export type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "Qualified" | "Nurturing" | "Proposal Sent" | "Lost";
  source: string;
  lastActivity: string;
};

export type Task = {
  id: number;
  title: string;
  type: "Call" | "Email" | "Meeting" | "Follow-up";
  related: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

export type SDRStats = {
  leadsThisMonth: number;
  callsMade: number;
  emailsSent: number;
  meetingsBooked: number;
  quotaAttained: number;
  pipelineValue: string;
};

export type SDR = {
  id: string;
  name: string;
  initials: string;
  role: "SDR" | "Senior SDR" | "Manager";
  email: string;
  stats: SDRStats;
  leads: Lead[];
  tasks: Task[];
};

export const SDRS: SDR[] = [
  {
    id: "vanshaj",
    name: "Vanshaj K.",
    initials: "VK",
    role: "SDR",
    email: "vanshaj.k@itilite.com",
    stats: { leadsThisMonth: 47, callsMade: 183, emailsSent: 412, meetingsBooked: 14, quotaAttained: 74, pipelineValue: "₹18.4L" },
    leads: [
      { id: 1, name: "Arjun Mehta", company: "InfraCloud", email: "arjun@infracloud.io", phone: "+91 98001 11234", status: "Contacted", source: "LinkedIn", lastActivity: "Today" },
      { id: 2, name: "Priya Nair", company: "FinEdge", email: "priya.nair@finedge.in", phone: "+91 98002 22345", status: "Qualified", source: "Referral", lastActivity: "Today" },
      { id: 3, name: "Rahul Sharma", company: "BuildBridge", email: "rahul@buildbridge.com", phone: "+91 98003 33456", status: "New", source: "Cold Outreach", lastActivity: "Yesterday" },
      { id: 4, name: "Sneha Kapoor", company: "LogiCore", email: "sneha.k@logicore.in", phone: "+91 98004 44567", status: "Nurturing", source: "Conference", lastActivity: "Aug 29" },
      { id: 5, name: "Deepak Joshi", company: "TechVault", email: "deepak@techvault.io", phone: "+91 98005 55678", status: "Proposal Sent", source: "Website", lastActivity: "Aug 29" },
      { id: 6, name: "Meera Iyer", company: "Nexify", email: "meera@nexify.com", phone: "+91 98006 66789", status: "New", source: "LinkedIn", lastActivity: "Aug 28" },
      { id: 7, name: "Karan Desai", company: "SwiftOps", email: "karan@swiftops.in", phone: "+91 98007 77890", status: "Lost", source: "Cold Outreach", lastActivity: "Aug 27" },
      { id: 8, name: "Ananya Roy", company: "PulseHR", email: "ananya@pulsehr.com", phone: "+91 98008 88901", status: "Contacted", source: "Referral", lastActivity: "Aug 26" },
    ],
    tasks: [
      { id: 1, title: "Call Arjun Mehta for product demo", type: "Call", related: "Arjun Mehta (InfraCloud)", dueDate: "Today", priority: "High", done: false },
      { id: 2, title: "Send demo recording to Priya Nair", type: "Email", related: "Priya Nair (FinEdge)", dueDate: "Today", priority: "High", done: false },
      { id: 3, title: "Cold call 10 leads from segment A", type: "Call", related: "—", dueDate: "Today", priority: "Medium", done: false },
      { id: 4, title: "Follow up on proposal with Deepak Joshi", type: "Follow-up", related: "Deepak Joshi (TechVault)", dueDate: "Tomorrow", priority: "High", done: false },
      { id: 5, title: "Schedule intro call with Meera Iyer", type: "Meeting", related: "Meera Iyer (Nexify)", dueDate: "Tomorrow", priority: "Medium", done: false },
      { id: 6, title: "Update CRM with call notes", type: "Follow-up", related: "—", dueDate: "Today", priority: "Low", done: true },
    ],
  },
  {
    id: "aisha",
    name: "Aisha Rao",
    initials: "AR",
    role: "Senior SDR",
    email: "aisha.r@itilite.com",
    stats: { leadsThisMonth: 61, callsMade: 224, emailsSent: 530, meetingsBooked: 21, quotaAttained: 91, pipelineValue: "₹27.6L" },
    leads: [
      { id: 101, name: "Vivek Malhotra", company: "CloudNine", email: "vivek@cloudnine.io", phone: "+91 98101 11234", status: "Qualified", source: "LinkedIn", lastActivity: "Today" },
      { id: 102, name: "Sanya Patel", company: "HRify", email: "sanya@hrify.in", phone: "+91 98102 22345", status: "Proposal Sent", source: "Referral", lastActivity: "Today" },
      { id: 103, name: "Nikhil Bose", company: "DataBridge", email: "nikhil@databridge.com", phone: "+91 98103 33456", status: "Contacted", source: "Conference", lastActivity: "Yesterday" },
      { id: 104, name: "Tara Singh", company: "FleetEdge", email: "tara@fleetedge.in", phone: "+91 98104 44567", status: "Qualified", source: "Website", lastActivity: "Aug 29" },
      { id: 105, name: "Akash Gupta", company: "PayFast", email: "akash@payfast.io", phone: "+91 98105 55678", status: "New", source: "Cold Outreach", lastActivity: "Aug 28" },
      { id: 106, name: "Isha Menon", company: "GrowStack", email: "isha@growstack.com", phone: "+91 98106 66789", status: "Nurturing", source: "LinkedIn", lastActivity: "Aug 27" },
    ],
    tasks: [
      { id: 101, title: "Demo call with Sanya Patel", type: "Call", related: "Sanya Patel (HRify)", dueDate: "Today", priority: "High", done: false },
      { id: 102, title: "Send pricing deck to Vivek Malhotra", type: "Email", related: "Vivek Malhotra (CloudNine)", dueDate: "Today", priority: "High", done: true },
      { id: 103, title: "Follow up with Nikhil Bose", type: "Follow-up", related: "Nikhil Bose (DataBridge)", dueDate: "Tomorrow", priority: "Medium", done: false },
      { id: 104, title: "Qualify call with Akash Gupta", type: "Call", related: "Akash Gupta (PayFast)", dueDate: "Tomorrow", priority: "High", done: false },
      { id: 105, title: "Update segment B outreach list", type: "Follow-up", related: "—", dueDate: "Today", priority: "Low", done: true },
    ],
  },
  {
    id: "rohit",
    name: "Rohit Verma",
    initials: "RV",
    role: "SDR",
    email: "rohit.v@itilite.com",
    stats: { leadsThisMonth: 33, callsMade: 142, emailsSent: 290, meetingsBooked: 9, quotaAttained: 55, pipelineValue: "₹11.2L" },
    leads: [
      { id: 201, name: "Gaurav Jain", company: "TravelTech", email: "gaurav@traveltech.in", phone: "+91 98201 11234", status: "New", source: "Cold Outreach", lastActivity: "Today" },
      { id: 202, name: "Pooja Sharma", company: "RetailX", email: "pooja@retailx.com", phone: "+91 98202 22345", status: "Contacted", source: "LinkedIn", lastActivity: "Yesterday" },
      { id: 203, name: "Sameer Khan", company: "UrbanMove", email: "sameer@urbanmove.in", phone: "+91 98203 33456", status: "New", source: "Referral", lastActivity: "Aug 29" },
      { id: 204, name: "Divya Nair", company: "EduCore", email: "divya@educore.io", phone: "+91 98204 44567", status: "Nurturing", source: "Conference", lastActivity: "Aug 28" },
      { id: 205, name: "Harish Rao", company: "SupplyLink", email: "harish@supplylink.in", phone: "+91 98205 55678", status: "Qualified", source: "Website", lastActivity: "Aug 27" },
    ],
    tasks: [
      { id: 201, title: "Cold call 15 leads from segment C", type: "Call", related: "—", dueDate: "Today", priority: "High", done: false },
      { id: 202, title: "Send intro email to Gaurav Jain", type: "Email", related: "Gaurav Jain (TravelTech)", dueDate: "Today", priority: "Medium", done: false },
      { id: 203, title: "Follow up with Divya Nair", type: "Follow-up", related: "Divya Nair (EduCore)", dueDate: "Tomorrow", priority: "Medium", done: false },
      { id: 204, title: "Qualify call with Harish Rao", type: "Meeting", related: "Harish Rao (SupplyLink)", dueDate: "Tomorrow", priority: "High", done: false },
    ],
  },
  {
    id: "neha",
    name: "Neha Singh",
    initials: "NS",
    role: "Manager",
    email: "neha.s@itilite.com",
    stats: { leadsThisMonth: 141, callsMade: 549, emailsSent: 1232, meetingsBooked: 44, quotaAttained: 73, pipelineValue: "₹57.2L" },
    leads: [],
    tasks: [
      { id: 301, title: "Weekly 1:1 with Vanshaj K.", type: "Meeting", related: "Vanshaj K.", dueDate: "Today", priority: "High", done: false },
      { id: 302, title: "Review Rohit's pipeline", type: "Follow-up", related: "Rohit Verma", dueDate: "Today", priority: "High", done: false },
      { id: 303, title: "Send team quota report to leadership", type: "Email", related: "—", dueDate: "Tomorrow", priority: "Medium", done: false },
      { id: 304, title: "Coaching session: objection handling", type: "Meeting", related: "Team", dueDate: "Sep 1", priority: "Medium", done: false },
    ],
  },
];
