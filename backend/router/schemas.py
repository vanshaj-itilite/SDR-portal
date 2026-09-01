"""Pydantic request/response models — the only place shapes coming off
the wire are defined. FastAPI uses these to parse and validate the raw
request before router/ ever calls into handler/."""
from pydantic import BaseModel, Field


class GoogleLoginRequest(BaseModel):
    code: str = Field(min_length=1)
    redirect_uri: str = Field(min_length=1)


class CreateCampaignRequest(BaseModel):
    name: str = Field(min_length=1)
    type: str
    goal: str = ""
    assigned_sdr_ids: list[str] = Field(min_length=1)
    lead_sources: list[str] = Field(min_length=1)
    lead_list_mode: str
    lead_list_value: str = Field(min_length=1)
