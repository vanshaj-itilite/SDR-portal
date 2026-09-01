"""In-memory user/session store, keyed by email.

Resolves id/role against the existing SDR roster (apis/sdrs.py) when the
logging-in email matches one; otherwise the user gets a generic "SDR"
role so anyone in the allowed Google Workspace domain can still log in.

Also holds the Google refresh token per user so Sheets can be re-synced
later without asking the user to log in again.
"""
import uuid

from apis import sdrs as sdrs_api

_USERS: dict[str, dict] = {}


def upsert_user(*, email: str, name: str, google_sub: str, refresh_token: str | None) -> dict:
    existing = _USERS.get(email)
    matched_sdr = sdrs_api.get_sdr_by_email(email)

    user = existing or {
        "id": matched_sdr["id"] if matched_sdr else f"user-{uuid.uuid4().hex[:8]}",
        "email": email,
        "name": matched_sdr["name"] if matched_sdr else name,
        "role": matched_sdr["role"] if matched_sdr else "SDR",
        "google_sub": google_sub,
        "refresh_token": None,
    }
    # Google only returns a refresh_token on the first consent; keep the
    # previously stored one if this login didn't get a new one.
    if refresh_token:
        user["refresh_token"] = refresh_token

    _USERS[email] = user
    return user


def get_user(email: str) -> dict | None:
    return _USERS.get(email)
