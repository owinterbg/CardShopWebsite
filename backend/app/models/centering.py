from app import db
from datetime import datetime
import json

class SavedCenteringRecord(db.Model):
    __tablename__ = 'saved_centering_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    image_index = db.Column(db.Integer, nullable=False)
    image_name = db.Column(db.String(255), nullable=True)
    outer_box = db.Column(db.Text, nullable=False)
    inner_box = db.Column(db.Text, nullable=False)
    horizontal_ratio = db.Column(db.String(20), nullable=False)
    vertical_ratio = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)  # ✅ fixed
    updated_at = db.Column(db.DateTime, default=None, onupdate=datetime.now)  # optional

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "image_index": self.image_index,
            "image_name": self.image_name,
            "outer_box": json.loads(self.outer_box),
            "inner_box": json.loads(self.inner_box),
            "horizontal_ratio": self.horizontal_ratio,
            "vertical_ratio": self.vertical_ratio,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
