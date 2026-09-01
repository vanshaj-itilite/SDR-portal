from fastapi import APIRouter

from handler import sdrs as sdrs_handler
from utils.responses import success

router = APIRouter(prefix="/sdrs", tags=["sdrs"])


@router.get("")
def list_sdrs():
    return success(sdrs_handler.handle_list_sdrs())
