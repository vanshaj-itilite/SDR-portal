"""Worker functions talking to Google's OAuth endpoints.

Plain in, plain out — no FastAPI / Request objects. Uses `requests`
directly against Google's REST endpoints rather than the heavy
google-api-python-client.
"""
import requests
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from utils import config
from utils.exceptions import ValidationError

TOKEN_URL = "https://oauth2.googleapis.com/token"


def exchange_code(code: str, redirect_uri: str) -> dict:
    """Exchanges an OAuth authorization code for id/access/refresh tokens."""
    resp = requests.post(
        TOKEN_URL,
        data={
            "code": code,
            "client_id": config.GOOGLE_CLIENT_ID,
            "client_secret": config.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    if not resp.ok:
        raise ValidationError(f"Google token exchange failed: {resp.text}")
    return resp.json()


def refresh_access_token(refresh_token: str) -> dict:
    resp = requests.post(
        TOKEN_URL,
        data={
            "refresh_token": refresh_token,
            "client_id": config.GOOGLE_CLIENT_ID,
            "client_secret": config.GOOGLE_CLIENT_SECRET,
            "grant_type": "refresh_token",
        },
        timeout=10,
    )
    if not resp.ok:
        raise ValidationError(f"Google token refresh failed: {resp.text}")
    return resp.json()


def verify_id_token(token: str) -> dict:
    """Returns {email, name, sub, hd} from a verified Google ID token."""
    try:
        claims = google_id_token.verify_oauth2_token(
            token, google_requests.Request(), config.GOOGLE_CLIENT_ID
        )
    except ValueError as e:
        raise ValidationError(f"Invalid Google ID token: {e}")
    return {
        "email": claims.get("email", ""),
        "name": claims.get("name", claims.get("email", "")),
        "sub": claims.get("sub", ""),
        "hd": claims.get("hd", ""),
    }
