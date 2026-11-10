# Microplastic Detection System

A full-stack computer vision web application designed to automatically detect, classify, and count microplastic particles in water sample microscopy images. This project serves as a 5th-semester CSE research prototype.

## 🚀 Features

- **Automated Inference**: Uses a custom-trained YOLOv8s object detection model to identify microplastics in real-time.
- **Detailed Classification**: Distinguishes between different types of particles, specifically **Fibers** and **Microplastics (Fragments)**.
- **Interactive UI**: A modern, responsive dashboard built with React and Tailwind CSS, featuring live inference metrics and a visual bounding-box overlay.
- **Detection Logging**: A dynamic table listing every detected particle's class, confidence score, and exact spatial coordinates (x, y, w, h).
- **CSV Export**: One-click download of the inference results for further environmental research and data analysis.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)

**Backend & Machine Learning:**
- Python 3.x
- Flask & Flask-CORS (API Bridge)
- Ultralytics YOLOv8 (Inference Engine)
- OpenCV (`cv2`) & Pillow (Image Processing)

## ⚙️ Local Setup Instructions

This project requires both the Flask backend and the React frontend to run concurrently.

### 1. Backend Setup (Python / Flask)
Open your terminal and navigate to the `backend` directory:
```bash
cd backend
```
Install the required dependencies:
```bash
pip install flask flask-cors ultralytics opencv-python pillow
```
*(Optional: If you generated a requirements.txt, you can use `pip install -r requirements.txt`)*

Ensure your trained YOLOv8 weights file (`best.pt`) is placed in the root of the backend folder. Start the server:
```bash
python app.py
```
*The Flask API will run on `http://localhost:5000`.*

### 2. Frontend Setup (React / Vite)
Open a **new** terminal window and navigate to the `frontend` directory:
```bash
cd frontend
```
Install Node modules:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
*The React UI will typically run on `http://localhost:5173` (or 5174).*

## 📖 How to Use

1. Open the local React frontend in your web browser.
2. Drag & drop or browse for a water sample microscopy image (PNG, JPG).
3. Click **Run Inference** to send the image to the YOLOv8 model.
4. View the annotated image with drawn bounding boxes.
5. Review the Inference Metrics (Total, Fibers, Microplastics, Avg. Confidence, Speed).
6. Check the Detection Log table and click **Export** to download the CSV report.

## 📝 License
Created for academic research and 5th-semester mini-project demonstration.