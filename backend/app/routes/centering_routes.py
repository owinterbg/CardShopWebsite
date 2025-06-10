# app/routes/centering_routes.py

from datetime import datetime
import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename
import os

from app import db
from app.models.centering import SavedCenteringRecord

centering_bp = Blueprint('centering', __name__)

@centering_bp.route('/api/compare', methods=['POST'])
def compare_images():
    image1 = request.files.get('image1')
    image2 = request.files.get('image2')

    if not image1 or not image2:
        return jsonify({'error': 'Both images must be uploaded'}), 400

    # Dummy bounding boxes — Replace with detection logic
    outer_box1 = {"x": 30, "y": 40, "width": 120, "height": 160}
    inner_box1 = {"x": 40, "y": 50, "width": 100, "height": 140}

    outer_box2 = {"x": 50, "y": 60, "width": 100, "height": 140}
    inner_box2 = {"x": 60, "y": 70, "width": 80, "height": 120}

    return jsonify({
        "bounding_boxes": [
            [outer_box1, inner_box1],  # image1
            [outer_box2, inner_box2]   # image2
        ]
    })
    
@centering_bp.route('/api/save_centering', methods=['POST'])
@jwt_required()
def save_centering():
    user_id = get_jwt_identity()

    image = request.files.get('image')
    if not image:
        return jsonify({"error": "Image is required"}), 400

    os.makedirs('static/uploads', exist_ok=True)
    filename = secure_filename(image.filename)
    image_path = os.path.join('static/uploads', filename)
    image.save(image_path)

    metadata = request.form.get("metadata")
    if not metadata:
        return jsonify({"error": "Metadata is required"}), 400

    data = json.loads(metadata)

    try:
        # ✅ Check for existing record by user_id + image_index
        existing = SavedCenteringRecord.query.filter_by(
            user_id=user_id,
            image_index=data['image_index']
        ).first()

        if existing:
            # Update existing record
            existing.outer_box = json.dumps(data['outer_box'])
            existing.inner_box = json.dumps(data['inner_box'])
            existing.horizontal_ratio = data['horizontal_ratio']
            existing.vertical_ratio = data['vertical_ratio']
            existing.image_name = filename
            existing.updated_at = datetime.now()
            db.session.commit()
            return jsonify({"message": "Centering updated", "record": existing.to_dict()}), 200
        else:
            # Create new record
            new_record = SavedCenteringRecord(
                user_id=user_id,
                image_index=data['image_index'],
                image_name=filename,
                outer_box=json.dumps(data['outer_box']),
                inner_box=json.dumps(data['inner_box']),
                horizontal_ratio=data['horizontal_ratio'],
                vertical_ratio=data['vertical_ratio']
            )
            db.session.add(new_record)
            db.session.commit()
            return jsonify({"message": "Centering saved", "record": new_record.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@centering_bp.route('/api/centerings', methods=['GET'])
@jwt_required()
def get_user_centerings():
    user_id = get_jwt_identity()
    records = SavedCenteringRecord.query.filter_by(user_id=user_id).order_by(SavedCenteringRecord.created_at.desc()).all()
    return jsonify([record.to_dict() for record in records])

@centering_bp.route('/api/centerings/<int:record_id>', methods=['GET'])
@jwt_required()
def get_centering_record(record_id):
    user_id = get_jwt_identity()
    record = SavedCenteringRecord.query.get_or_404(record_id)
    if record.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify(record.to_dict())

@centering_bp.route('/api/centerings/<int:record_id>', methods=['PUT'])
@jwt_required()
def update_centering_record(record_id):
    user_id = get_jwt_identity()
    record = SavedCenteringRecord.query.get_or_404(record_id)
    if record.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    record.outer_box = json.dumps(data["outer_box"])
    record.inner_box = json.dumps(data["inner_box"])
    record.horizontal_ratio = data["horizontal_ratio"]
    record.vertical_ratio = data["vertical_ratio"]
    record.updated_at = datetime.now()

    db.session.commit()
    return jsonify({"message": "Updated", "record": record.to_dict()})

@centering_bp.route('/api/centerings/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_centering_record(record_id):
    user_id = get_jwt_identity()
    record = SavedCenteringRecord.query.get_or_404(record_id)

    if record.user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    # Attempt to delete associated image
    if record.image_name:
        image_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'uploads', record.image_name))
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except Exception as e:
                return jsonify({"error": f"Failed to delete image: {str(e)}"}), 500

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Centering record deleted"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete record: {str(e)}"}), 500
