# In file: backend/python_model/app.py

from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
from flask_cors import CORS # <-- ADD THIS IMPORT

app = Flask(__name__)
CORS(app) #
try:
    model = YOLO('best.pt')
    print("✅ YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading YOLOv8 model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model could not be loaded'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    try:
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        results = model(image)

        detections = []
        result = results[0]
        class_names = result.names

        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = class_names[class_id]
            confidence = float(box.conf[0])
            bounding_box = box.xyxy[0].tolist()

            detections.append({
                'breed': class_name,
                'confidence': confidence,
                'bounding_box': bounding_box
            })

        print(f"✅ Found {len(detections)} detections.")
        return jsonify(detections)

    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return jsonify({'error': 'Error processing image'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)