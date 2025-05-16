from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserSchema(BaseModel):
    id: int
    username: str
    email: str
    password_hash: str
    created_at: datetime
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True
    }
