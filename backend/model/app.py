from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask application

# Load the saved model
model = load_model("backend/model/asl_alphabet_cnn.h5")

# Define class labels
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

# Initialize MediaPipe Hands
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

# Initialize the Hands module
hands = mp_hands.Hands()

def preprocess_frame(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    frame = cv2.resize(frame, (32, 32))  # Resize to target size
    frame = frame / 255.0  # Normalize pixels
    frame = np.expand_dims(frame, axis=-1)  # Add channel dimension
    frame = np.expand_dims(frame, axis=0)  # Add batch dimension
    return frame

@app.route('/detect-sign-language', methods=['POST'])
def detect_sign_language():
    # Read the frame from the POST data
    frame = cv2.imdecode(np.frombuffer(request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)

    # Convert the image to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the image to detect hands
    results = hands.process(image)

    letters = []

    # Check if any hands are detected
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Extract the region of interest (ROI) containing the hand
            h, w, _ = frame.shape
            x_min = min([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_min = min([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_max = max([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_max = max([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_min, x_max = int(x_min), int(x_max)
            y_min, y_max = int(y_min), int(y_max)

            # Ensure coordinates are within image bounds
            x_min = max(0, x_min)
            y_min = max(0, y_min)
            x_max = min(w, x_max)
            y_max = min(h, y_max)

            # Extract and preprocess the region of interest (ROI)
            roi = frame[y_min:y_max, x_min:x_max]
            if roi.size != 0:
                processed_roi = preprocess_frame(roi)
                # Make a prediction
                predictions = model.predict(processed_roi)
                predicted_class = labels[np.argmax(predictions)]
                # Store the predicted letter in the list
                letters.append(predicted_class)

    return jsonify({"letters": letters})

if __name__ == '__main__':
    app.run(debug=True)
