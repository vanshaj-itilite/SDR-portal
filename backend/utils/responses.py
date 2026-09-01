"""Standard response envelope used by every handler."""
from typing import Any


def success(data: Any = None, message: str = "OK") -> dict:
    return {"success": True, "message": message, "data": data}


def error(message: str, data: Any = None) -> dict:
    return {"success": False, "message": message, "data": data}
