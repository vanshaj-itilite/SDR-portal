"""Route definitions for /auth, plus the get_current_user dependency
shared by every protected router. Reading the Authorization header is
the raw-request handling this module (and handler/) is allowed to do —
apis/ never sees it.
"""
from fastapi import APIRouter, Depends, Header, HTTPException

from handler import auth as auth_handler
from router.schemas import GoogleLoginRequest
from utils.exceptions import ValidationError
from utils.responses import success

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        return auth_handler.handle_get_current_user(token)
    except ValidationError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/google")
def google_login(payload: GoogleLoginRequest):
    try:
        data = auth_handler.handle_google_login(payload.code, payload.redirect_uri)
    except ValidationError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return success(data, message="Logged in")


@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return success(current_user)
