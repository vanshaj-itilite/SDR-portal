"""Session token signing/verification. Pure logic — no FastAPI here."""
import time

import jwt

from utils import config


def sign_session_token(user: dict) -> str:
    now = int(time.time())
    payload = {
        "sub": user["email"],
        "id": user["id"],
        "name": user["name"],
        "role": user["role"],
        "iat": now,
        "exp": now + config.JWT_TTL_SECONDS,
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")


def decode_session_token(token: str) -> dict:
    """Raises jwt.PyJWTError (ExpiredSignatureError, InvalidTokenError, ...) on failure."""
    payload = jwt.decode(token, config.JWT_SECRET, algorithms=["HS256"])
    return {
        "email": payload["sub"],
        "id": payload["id"],
        "name": payload["name"],
        "role": payload["role"],
    }
