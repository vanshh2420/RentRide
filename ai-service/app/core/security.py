from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings

API_KEY_HEADER = APIKeyHeader(name="X-AI-API-KEY", auto_error=False)

async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    if not api_key or api_key != settings.AI_SERVICE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing AI Service API Key"
        )
    return api_key
