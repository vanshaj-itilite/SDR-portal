"""Route definitions for /campaigns.

Thin by design: parse the request (FastAPI does this via typed params /
the Pydantic models in schemas.py, plus the get_current_user dependency
for the logged-in user), call the matching handler/ function, translate
its result or its domain exceptions into an HTTP response. No processing
logic lives here.
"""
from fastapi import APIRouter, Depends, HTTPException

from handler import campaigns as campaigns_handler
from router.auth import get_current_user
from router.schemas import CreateCampaignRequest
from utils.exceptions import NotFoundError, ValidationError
from utils.responses import success

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("")
def list_campaigns(sdr_id: str | None = None):
    data = campaigns_handler.handle_list_campaigns(sdr_id)
    return success(data)


@router.get("/{campaign_id}")
def get_campaign(campaign_id: str):
    try:
        data = campaigns_handler.handle_get_campaign(campaign_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return success(data)


@router.post("")
def create_campaign(payload: CreateCampaignRequest, current_user: dict = Depends(get_current_user)):
    try:
        data = campaigns_handler.handle_create_campaign(
            name=payload.name,
            campaign_type=payload.type,
            goal=payload.goal,
            assigned_sdr_ids=payload.assigned_sdr_ids,
            lead_sources=payload.lead_sources,
            lead_list_mode=payload.lead_list_mode,
            lead_list_value=payload.lead_list_value,
            current_user=current_user,
        )
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return success(data, message="Campaign created")


@router.post("/{campaign_id}/sync-sheet")
def sync_campaign_sheet(campaign_id: str, current_user: dict = Depends(get_current_user)):
    try:
        data = campaigns_handler.handle_sync_campaign_sheet(campaign_id, current_user)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return success(data, message="Synced from Google Sheet")
