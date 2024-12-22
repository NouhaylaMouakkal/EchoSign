from flask import Flask, request, jsonify, send_from_directory
import cv2
import imageio
import os
from flask_cors import CORS
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

#################################################################
##                       Text To Sign Part                     ##
#################################################################

def afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num):
    frames = []
    for lettre in texte.lower():
        if lettre.isalpha():
            chemin_image = f"./Reverse/{lettre}.gif"
            if os.path.exists(chemin_image):
                try:
                    animation = imageio.get_reader(chemin_image)
                    for frame in animation:
                        resized_frame = cv2.resize(np.array(frame), (target_width, target_height))
                        frames.append(resized_frame)
                except Exception as e:
                    print(f"Une erreur est survenue : {e}")
            else:
                print(f"Animation GIF introuvable pour la lettre '{lettre}'")
        else:
            print(f"Le caractère '{lettre}' n'est pas une lettre de l'alphabet")
    
    if frames:
        output_frames = []
        for frame in frames:
            for _ in range(delay_between_letters):
                output_frames.append(frame)
        
        # CHANGED: Write the file to the local 'videos' folder in the backend container
        output_video_path = f"./videos/output{req_num}.mp4"
        out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'H264'), 10, (target_width, target_height))
        for frame in output_frames:
            out.write(frame)
        out.release()
        print(f"Vidéo créée : {output_video_path}")
        return output_video_path
    else:
        return None

@app.route('/', methods=['GET'])
def test():
    return jsonify({"message": "BACKEND WORKS"}), 200

@app.route('/active', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# NEW: Route to serve video files from the ./videos folder
@app.route('/videos/<path:filename>', methods=['GET'])
def serve_video(filename):
    return send_from_directory('videos', filename)


@app.route('/generate-video', methods=['POST'])
def generate_video():
    data = request.json
    texte = data.get('texte')
    target_width = data.get('target_width', 600)
    target_height = data.get('target_height', 500)
    delay_between_letters = data.get('delay_between_letters', 10)
    req_num = data.get('req_num', 1)

    video_path = afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num)
    
    if video_path:
        filename = os.path.basename(video_path)
        video_url = f"{request.host_url}videos/{filename}"
        return jsonify({"video_url": video_url})
    else:
        return jsonify({"error": "Erreur lors de la génération de la vidéo"}), 500

#################################################################
##                       Sign To Text Part                     ##
#################################################################

# Load the saved model
model = load_model("./model/asl_alphabet_cnn.h5")

# Define class labels
labels = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space'
]

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
    app.run(debug=True, host='0.0.0.0', port=2002)