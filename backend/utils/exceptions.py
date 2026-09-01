"""Domain-level exceptions. Handlers catch these and translate them into
HTTPException at the router boundary — apis/ never imports FastAPI."""


class NotFoundError(Exception):
    pass


class ValidationError(Exception):
    pass
