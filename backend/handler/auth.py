"""Orchestration for Google login. Called by router/auth.py with plain
values (never a raw Request). Coordinates apis/google_auth + apis/users
and issues the app's own session token.
"""
import jwt as pyjwt

from apis import google_auth as google_auth_api
from apis import users as users_api
from utils import config
from utils.exceptions import ValidationError
from utils.jwt import decode_session_token, sign_session_token


def handle_google_login(code: str, redirect_uri: str) -> dict:
    tokens = google_auth_api.exchange_code(code, redirect_uri)
    id_info = google_auth_api.verify_id_token(tokens["id_token"])

    email = id_info["email"]
    domain_ok = id_info.get("hd") == config.ALLOWED_EMAIL_DOMAIN or email.endswith(
        f"@{config.ALLOWED_EMAIL_DOMAIN}"
    )
    if not domain_ok:
        raise ValidationError(f"Only @{config.ALLOWED_EMAIL_DOMAIN} accounts can sign in")

    user = users_api.upsert_user(
        email=email,
        name=id_info["name"],
        google_sub=id_info["sub"],
        refresh_token=tokens.get("refresh_token"),
    )

    session_token = sign_session_token(user)
    return {"user": _public_user(user), "token": session_token}


def handle_get_current_user(session_token: str) -> dict:
    try:
        claims = decode_session_token(session_token)
    except pyjwt.PyJWTError:
        raise ValidationError("Invalid or expired session")
    return claims


def _public_user(user: dict) -> dict:
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
