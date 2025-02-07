import logging
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    GEMINI_API_ENDPOINT: str
    UPLOAD_DIR:str
    OCR_AGENT:str

    class Config:
        env_file = ".env"

settings = Settings()


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
