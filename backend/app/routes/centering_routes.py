# app/routes/centering_routes.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

centering_bp = Blueprint('centering', __name__)

@centering_bp.route('/api/compare', methods=['POST'])
def compare_images():
    image1 = request.files.get('image1')
    image2 = request.files.get('image2')

    if not image1 or not image2:
        return jsonify({'error': 'Both images must be uploaded'}), 400

    os.makedirs('temp', exist_ok=True)
    image1_path = os.path.join('temp', secure_filename(image1.filename))
    image2_path = os.path.join('temp', secure_filename(image2.filename))
    image1.save(image1_path)
    image2.save(image2_path)

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
