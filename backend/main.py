"""Entry point: builds the FastAPI app, wires CORS + routers, and exposes
the Mangum handler for Lambda. Run locally with:

    uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from router.auth import router as auth_router
from router.campaigns import router as campaigns_router
from router.sdrs import router as sdrs_router
from utils.config import CORS_ORIGINS

app = FastAPI(title="SDR Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(campaigns_router)
app.include_router(sdrs_router)


@app.get("/health")
def health():
    return {"status": "ok"}


handler = Mangum(app)
