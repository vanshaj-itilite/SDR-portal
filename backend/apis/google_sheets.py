"""Worker functions for reading a Google Sheet's values over the plain
REST API (no google-api-python-client dependency).

Plain in, plain out — no FastAPI / Request objects.
"""
import re

import requests

from utils.exceptions import ValidationError

_SHEET_ID_RE = re.compile(r"/spreadsheets/d/([a-zA-Z0-9-_]+)")

# Column header -> lead field, matched case-insensitively, first match wins.
_HEADER_ALIASES = {
    "name": ["name", "lead name", "full name"],
    "company": ["company", "organization", "account"],
    "email": ["email", "email address"],
    "phone": ["phone", "phone number", "mobile"],
    "source": ["source", "lead source"],
}


def parse_spreadsheet_id(url: str) -> str:
    match = _SHEET_ID_RE.search(url)
    if not match:
        raise ValidationError("Could not find a spreadsheet id in that link")
    return match.group(1)


def fetch_values(access_token: str, spreadsheet_id: str, range_: str = "A:Z") -> list[list[str]]:
    resp = requests.get(
        f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{range_}",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if resp.status_code == 403:
        raise ValidationError("This Google account doesn't have access to that sheet")
    if resp.status_code == 404:
        raise ValidationError("Spreadsheet not found — check the link")
    if not resp.ok:
        raise ValidationError(f"Failed to read the sheet: {resp.text}")
    return resp.json().get("values", [])


def rows_to_leads(rows: list[list[str]]) -> list[dict]:
    if not rows:
        return []

    header = [cell.strip().lower() for cell in rows[0]]
    field_by_col: dict[int, str] = {}
    for field, aliases in _HEADER_ALIASES.items():
        for col_idx, col_name in enumerate(header):
            if col_name in aliases:
                field_by_col[col_idx] = field
                break

    leads = []
    for row in rows[1:]:
        if not any(cell.strip() for cell in row if cell):
            continue
        lead = {"name": "", "company": "", "email": "", "phone": "", "source": ""}
        for col_idx, field in field_by_col.items():
            if col_idx < len(row):
                lead[field] = row[col_idx].strip()
        if lead["name"] or lead["email"]:
            leads.append(lead)
    return leads
