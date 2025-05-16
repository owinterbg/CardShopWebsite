from app.models.user import User
from schemas.user_schema import UserSchema
from flask import abort

def get_serialized_user_by_id(user_id: int) -> dict:
    user = User.query.get(user_id)
    if not user:
        abort(404, description="User not found")
    return UserSchema.model_validate(user).model_dump()
