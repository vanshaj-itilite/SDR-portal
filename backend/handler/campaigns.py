"""Orchestration layer for the Campaign resource.

Called by router/campaigns.py with plain, already-validated values (path
params, query params, request-model fields, the current_user resolved by
the auth dependency) — never a raw Request object. Coordinates one or
more apis/ worker calls and returns plain dicts; domain errors are raised
as utils.exceptions.* for the router to translate into the right HTTP
status.
"""
from apis import campaigns as campaigns_api
from apis import google_auth as google_auth_api
from apis import google_sheets as sheets_api
from apis import sdrs as sdrs_api
from apis import users as users_api
from utils.exceptions import ValidationError


def handle_list_campaigns(sdr_id: str | None) -> list[dict]:
    campaigns = (
        campaigns_api.list_campaigns_for_sdr(sdr_id)
        if sdr_id
        else campaigns_api.list_campaigns()
    )
    return [_with_stats(c) for c in campaigns]


def handle_get_campaign(campaign_id: str) -> dict:
    campaign = campaigns_api.get_campaign(campaign_id)
    return _with_stats(campaign)


def handle_create_campaign(
    *,
    name: str,
    campaign_type: str,
    goal: str,
    assigned_sdr_ids: list[str],
    lead_sources: list[str],
    lead_list_mode: str,
    lead_list_value: str,
    current_user: dict,
) -> dict:
    if not assigned_sdr_ids:
        raise ValidationError("At least one SDR must be assigned")
    if not sdrs_api.sdr_ids_exist(assigned_sdr_ids):
        raise ValidationError("One or more assigned SDR ids are invalid")
    if not lead_sources:
        raise ValidationError("At least one lead source must be selected")
    if lead_list_mode not in ("upload", "link"):
        raise ValidationError("lead_list_mode must be 'upload' or 'link'")
    if not lead_list_value:
        raise ValidationError("A lead list file name or link is required")

    enrolled_leads = None
    if lead_list_mode == "link":
        rows = _fetch_sheet_leads(lead_list_value, current_user)
        enrolled_leads = campaigns_api.leads_from_sheet_rows(rows, assigned_sdr_ids)

    campaign = campaigns_api.create_campaign(
        name=name,
        campaign_type=campaign_type,
        goal=goal,
        assigned_sdr_ids=assigned_sdr_ids,
        lead_sources=lead_sources,
        lead_list_mode=lead_list_mode,
        lead_list_value=lead_list_value,
        enrolled_leads=enrolled_leads,
    )
    return _with_stats(campaign)


def handle_sync_campaign_sheet(campaign_id: str, current_user: dict) -> dict:
    campaign = campaigns_api.get_campaign(campaign_id)
    if campaign["lead_list_mode"] != "link" or not campaign["lead_list_value"]:
        raise ValidationError("This campaign isn't linked to a Google Sheet")

    rows = _fetch_sheet_leads(campaign["lead_list_value"], current_user)
    leads = campaigns_api.leads_from_sheet_rows(rows, campaign["assigned_sdr_ids"])
    campaign = campaigns_api.replace_enrolled_leads(campaign_id, leads)
    return _with_stats(campaign)


def _fetch_sheet_leads(sheet_url: str, current_user: dict) -> list[dict]:
    user = users_api.get_user(current_user["email"])
    if not user or not user.get("refresh_token"):
        raise ValidationError(
            "No Google Sheets access on file for this account — sign in again and grant Sheets access"
        )

    access_token = google_auth_api.refresh_access_token(user["refresh_token"])["access_token"]
    spreadsheet_id = sheets_api.parse_spreadsheet_id(sheet_url)
    values = sheets_api.fetch_values(access_token, spreadsheet_id)
    return sheets_api.rows_to_leads(values)


def _with_stats(campaign: dict) -> dict:
    return {**campaign, "stats": campaigns_api.compute_stats(campaign)}
