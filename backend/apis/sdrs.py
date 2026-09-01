"""Worker functions for the SDR resource.

No FastAPI / Request objects here — plain in, plain out. This module owns
the SDR data source; swap the in-memory store for a real DB without
touching router/ or handler/.
"""
from utils.exceptions import NotFoundError

_SDRS = [
    {"id": "vanshaj", "name": "Vanshaj K.", "initials": "VK", "role": "SDR", "email": "vanshaj.k@itilite.com"},
    {"id": "aisha", "name": "Aisha Rao", "initials": "AR", "role": "Senior SDR", "email": "aisha.r@itilite.com"},
    {"id": "rohit", "name": "Rohit Verma", "initials": "RV", "role": "SDR", "email": "rohit.v@itilite.com"},
    {"id": "neha", "name": "Neha Singh", "initials": "NS", "role": "Manager", "email": "neha.s@itilite.com"},
]


def list_sdrs() -> list[dict]:
    return _SDRS


def get_sdr(sdr_id: str) -> dict:
    for sdr in _SDRS:
        if sdr["id"] == sdr_id:
            return sdr
    raise NotFoundError(f"SDR '{sdr_id}' not found")


def get_sdr_by_email(email: str) -> dict | None:
    for sdr in _SDRS:
        if sdr["email"].lower() == email.lower():
            return sdr
    return None


def sdr_ids_exist(sdr_ids: list[str]) -> bool:
    known = {s["id"] for s in _SDRS}
    return all(sdr_id in known for sdr_id in sdr_ids)
