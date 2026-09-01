"""Worker functions for the Campaign resource.

Owns the campaign data source and every raw processing step (creating,
filtering, computing stats, shaping sheet rows into enrolled leads). No
FastAPI / Request objects here — plain in, plain out — so this module is
trivial to unit test and to swap onto a real DB later.
"""
import itertools
import uuid
from datetime import date, datetime

from utils.exceptions import NotFoundError


def _seed_campaigns() -> list[dict]:
    return [
        {
            "id": "c1", "name": "Intent", "type": "Multi-channel", "status": "Active",
            "goal": "Target in-market accounts showing buying intent signals — book 20 discovery calls",
            "start_date": "Aug 1, 2026", "end_date": "Sep 30, 2026",
            "assigned_sdr_ids": ["vanshaj", "aisha"],
            "lead_sources": ["LinkedIn"], "lead_list_mode": None, "lead_list_value": None,
            "sequence": [
                {"step": 1, "type": "Email", "label": "Intent trigger intro email", "day": "Day 1"},
                {"step": 2, "type": "LinkedIn", "label": "LinkedIn connection", "day": "Day 2"},
                {"step": 3, "type": "Email", "label": "Follow-up + value prop", "day": "Day 4"},
                {"step": 4, "type": "Call", "label": "Discovery call attempt", "day": "Day 6"},
                {"step": 5, "type": "Email", "label": "Case study share", "day": "Day 9"},
                {"step": 6, "type": "Call", "label": "Final call attempt", "day": "Day 12"},
                {"step": 7, "type": "Email", "label": "Break-up email", "day": "Day 16"},
            ],
            "enrolled_leads": [
                {"lead_id": 1, "lead_name": "Arjun Mehta", "company": "InfraCloud", "sdr_id": "vanshaj", "current_step": 4, "status": "Active", "last_touched": "Today"},
                {"lead_id": 2, "lead_name": "Priya Nair", "company": "FinEdge", "sdr_id": "vanshaj", "current_step": 5, "status": "Responded", "last_touched": "Today"},
                {"lead_id": 6, "lead_name": "Meera Iyer", "company": "Nexify", "sdr_id": "vanshaj", "current_step": 2, "status": "Active", "last_touched": "Aug 28"},
                {"lead_id": 101, "lead_name": "Vivek Malhotra", "company": "CloudNine", "sdr_id": "aisha", "current_step": 6, "status": "Responded", "last_touched": "Today"},
                {"lead_id": 103, "lead_name": "Nikhil Bose", "company": "DataBridge", "sdr_id": "aisha", "current_step": 3, "status": "Active", "last_touched": "Yesterday"},
                {"lead_id": 105, "lead_name": "Akash Gupta", "company": "PayFast", "sdr_id": "aisha", "current_step": 1, "status": "Active", "last_touched": "Aug 28"},
            ],
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "c2", "name": "Job Posts", "type": "Cold Call", "status": "Active",
            "goal": "Reach out to companies with active travel-related job postings as buying intent signal",
            "start_date": "Aug 15, 2026", "end_date": "Sep 15, 2026",
            "assigned_sdr_ids": ["vanshaj", "rohit"],
            "lead_sources": ["Cold Outreach"], "lead_list_mode": None, "lead_list_value": None,
            "sequence": [
                {"step": 1, "type": "Call", "label": "Initial cold call", "day": "Day 1"},
                {"step": 2, "type": "Email", "label": "Voicemail + job post hook", "day": "Day 1"},
                {"step": 3, "type": "Call", "label": "Second call attempt", "day": "Day 3"},
                {"step": 4, "type": "Email", "label": "ROI stats email", "day": "Day 5"},
                {"step": 5, "type": "Call", "label": "Decision-maker call", "day": "Day 8"},
            ],
            "enrolled_leads": [
                {"lead_id": 4, "lead_name": "Sneha Kapoor", "company": "LogiCore", "sdr_id": "vanshaj", "current_step": 3, "status": "Active", "last_touched": "Aug 29"},
                {"lead_id": 5, "lead_name": "Deepak Joshi", "company": "TechVault", "sdr_id": "vanshaj", "current_step": 5, "status": "Responded", "last_touched": "Aug 29"},
                {"lead_id": 8, "lead_name": "Ananya Roy", "company": "PulseHR", "sdr_id": "vanshaj", "current_step": 2, "status": "Active", "last_touched": "Aug 26"},
                {"lead_id": 201, "lead_name": "Gaurav Jain", "company": "TravelTech", "sdr_id": "rohit", "current_step": 1, "status": "Active", "last_touched": "Today"},
                {"lead_id": 205, "lead_name": "Harish Rao", "company": "SupplyLink", "sdr_id": "rohit", "current_step": 4, "status": "Responded", "last_touched": "Aug 27"},
                {"lead_id": 202, "lead_name": "Pooja Sharma", "company": "RetailX", "sdr_id": "rohit", "current_step": 2, "status": "Active", "last_touched": "Yesterday"},
            ],
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "c3", "name": "Job Change", "type": "LinkedIn", "status": "Active",
            "goal": "Engage decision-makers who recently changed roles — high propensity to buy in first 90 days",
            "start_date": "Aug 10, 2026", "end_date": "Sep 10, 2026",
            "assigned_sdr_ids": ["aisha"],
            "lead_sources": ["LinkedIn"], "lead_list_mode": None, "lead_list_value": None,
            "sequence": [
                {"step": 1, "type": "LinkedIn", "label": "Congrats on new role message", "day": "Day 1"},
                {"step": 2, "type": "LinkedIn", "label": "Value message + quick win", "day": "Day 3"},
                {"step": 3, "type": "Email", "label": "Move to email outreach", "day": "Day 6"},
                {"step": 4, "type": "Call", "label": "Intro call", "day": "Day 9"},
            ],
            "enrolled_leads": [
                {"lead_id": 102, "lead_name": "Sanya Patel", "company": "HRify", "sdr_id": "aisha", "current_step": 4, "status": "Converted", "last_touched": "Today"},
                {"lead_id": 104, "lead_name": "Tara Singh", "company": "FleetEdge", "sdr_id": "aisha", "current_step": 3, "status": "Responded", "last_touched": "Aug 29"},
                {"lead_id": 106, "lead_name": "Isha Menon", "company": "GrowStack", "sdr_id": "aisha", "current_step": 2, "status": "Active", "last_touched": "Aug 27"},
            ],
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "c4", "name": "Events", "type": "Email Sequence", "status": "Active",
            "goal": "Follow up with contacts from industry events and conferences attended in Q3",
            "start_date": "Jul 20, 2026", "end_date": "Aug 31, 2026",
            "assigned_sdr_ids": ["rohit"],
            "lead_sources": ["Conference"], "lead_list_mode": None, "lead_list_value": None,
            "sequence": [
                {"step": 1, "type": "Email", "label": "Great meeting you at [event]", "day": "Day 1"},
                {"step": 2, "type": "Email", "label": "Relevant resource share", "day": "Day 4"},
                {"step": 3, "type": "Call", "label": "Personal follow-up call", "day": "Day 7"},
                {"step": 4, "type": "Email", "label": "Customer story + CTA", "day": "Day 12"},
            ],
            "enrolled_leads": [
                {"lead_id": 203, "lead_name": "Sameer Khan", "company": "UrbanMove", "sdr_id": "rohit", "current_step": 2, "status": "Active", "last_touched": "Aug 29"},
                {"lead_id": 204, "lead_name": "Divya Nair", "company": "EduCore", "sdr_id": "rohit", "current_step": 1, "status": "Bounced", "last_touched": "Aug 28"},
            ],
            "created_at": datetime.utcnow().isoformat(),
        },
        {
            "id": "c5", "name": "Nurture", "type": "Email Sequence", "status": "Active",
            "goal": "Keep warm leads engaged over a longer cycle with value-driven touchpoints until they're ready to buy",
            "start_date": "Sep 1, 2026", "end_date": "Nov 30, 2026",
            "assigned_sdr_ids": ["aisha", "rohit"],
            "lead_sources": ["Website"], "lead_list_mode": None, "lead_list_value": None,
            "sequence": [
                {"step": 1, "type": "Email", "label": "Monthly newsletter / insight", "day": "Day 1"},
                {"step": 2, "type": "Email", "label": "Product update highlight", "day": "Day 14"},
                {"step": 3, "type": "LinkedIn", "label": "LinkedIn check-in", "day": "Day 21"},
                {"step": 4, "type": "Email", "label": "Case study + soft CTA", "day": "Day 30"},
                {"step": 5, "type": "Call", "label": "Quarterly check-in call", "day": "Day 45"},
            ],
            "enrolled_leads": [],
            "created_at": datetime.utcnow().isoformat(),
        },
    ]


_CAMPAIGNS: list[dict] = _seed_campaigns()
_lead_id_counter = itertools.count(1000)


def list_campaigns() -> list[dict]:
    return _CAMPAIGNS


def list_campaigns_for_sdr(sdr_id: str) -> list[dict]:
    return [c for c in _CAMPAIGNS if sdr_id in c["assigned_sdr_ids"]]


def get_campaign(campaign_id: str) -> dict:
    for campaign in _CAMPAIGNS:
        if campaign["id"] == campaign_id:
            return campaign
    raise NotFoundError(f"Campaign '{campaign_id}' not found")


def leads_from_sheet_rows(rows: list[dict], assigned_sdr_ids: list[str]) -> list[dict]:
    """Shapes generic {name, company, email, phone, source} sheet rows into
    this domain's enrolled_lead records, round-robining SDR assignment."""
    today = date.today().isoformat()
    sdr_cycle = itertools.cycle(assigned_sdr_ids) if assigned_sdr_ids else itertools.repeat(None)
    leads = []
    for row in rows:
        leads.append({
            "lead_id": next(_lead_id_counter),
            "lead_name": row.get("name") or row.get("email") or "Unknown",
            "company": row.get("company", ""),
            "sdr_id": next(sdr_cycle),
            "current_step": 1,
            "status": "Active",
            "last_touched": today,
        })
    return leads


def create_campaign(
    *,
    name: str,
    campaign_type: str,
    goal: str,
    assigned_sdr_ids: list[str],
    lead_sources: list[str],
    lead_list_mode: str,
    lead_list_value: str,
    enrolled_leads: list[dict] | None = None,
) -> dict:
    today = date.today().isoformat()
    campaign = {
        "id": f"c-{uuid.uuid4().hex[:10]}",
        "name": name,
        "type": campaign_type,
        "status": "Draft",
        "goal": goal,
        "start_date": today,
        "end_date": today,
        "assigned_sdr_ids": assigned_sdr_ids,
        "lead_sources": lead_sources,
        "lead_list_mode": lead_list_mode,
        "lead_list_value": lead_list_value,
        "sequence": [],
        "enrolled_leads": enrolled_leads or [],
        "created_at": datetime.utcnow().isoformat(),
    }
    _CAMPAIGNS.insert(0, campaign)
    return campaign


def replace_enrolled_leads(campaign_id: str, leads: list[dict]) -> dict:
    campaign = get_campaign(campaign_id)
    campaign["enrolled_leads"] = leads
    return campaign


def compute_stats(campaign: dict) -> dict:
    leads = campaign["enrolled_leads"]
    return {
        "total_enrolled": len(leads),
        "active": sum(1 for l in leads if l["status"] == "Active"),
        "responded": sum(1 for l in leads if l["status"] == "Responded"),
        "converted": sum(1 for l in leads if l["status"] == "Converted"),
        "unsubscribed": sum(1 for l in leads if l["status"] in ("Unsubscribed", "Bounced")),
    }
