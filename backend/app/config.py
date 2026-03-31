from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel


class Settings(BaseModel):
    env: str = os.getenv("ALFA_ENV", "dev")
    db_url: str = os.getenv("ALFA_DB_URL", "sqlite:///./alfa.db")
    secret_key: str = os.getenv("ALFA_SECRET_KEY", "change-me-in-production")
    api_base_url: str = os.getenv("ALFA_API_BASE_URL", "http://localhost:8000")

    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24  # 24 h


@lru_cache
def get_settings() -> Settings:
    return Settings()
