from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import base64
import cv2

app = Flask(__name__)
CORS(app) 

# Load the weights you trained in Colab
model = YOLO("best.pt") 

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read()))
    
    # 1. Added conf=0.5 to filter out the messy low-confidence guesses
    results = model.predict(image, conf=0.4)
    
    # 2. Adjusted font size and line width for cleaner image drawing
    annotated_img = results[0].plot(font_size=1, line_width=2)
    _, buffer = cv2.imencode('.jpg', annotated_img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    speed_ms = sum(results[0].speed.values())
    
    detections = []
    fibers_count = 0
    microplastics_count = 0
    
    for r in results:
        for box in r.boxes:
            raw_class = model.names[int(box.cls[0])]
            
            # 3. Unify the names: counts BOTH "fragment" and "Microplastic" accurately
            if raw_class.lower() == "fiber":
                display_class = "Fiber"
                fibers_count += 1
            elif raw_class.lower() in ["fragment", "microplastic"]:
                display_class = "Microplastic"
                microplastics_count += 1
            else:
                display_class = raw_class # Fallback just in case
                
            detections.append({
                "class": display_class, # Sends the clean name to the React table
                "confidence": float(box.conf[0]),
                "coordinates": box.xyxy[0].tolist() 
            })
            
    return jsonify({
        "particle_count": len(detections),
        "fibers_count": fibers_count,
        "fragments_count": microplastics_count, # React uses this key for the 3rd card
        "detections": detections,
        "inference_time": round(speed_ms, 1),
        "annotated_image": f"data:image/jpeg;base64,{img_base64}"
    })

if __name__ == "__main__":
    app.run(port=5000)