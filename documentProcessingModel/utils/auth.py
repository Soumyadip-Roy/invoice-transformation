from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from utils.config import settings

API_KEY_NAME = "access_token"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def get_api_key(api_key_header_value: str = Security(api_key_header)):

    if api_key_header_value == settings.FASTAPI_API_KEY:
        return api_key_header_value
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
