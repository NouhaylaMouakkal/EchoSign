from flask import Flask, request, jsonify
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
##################################################################

def afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num):
    frames = []
    for lettre in texte.lower():
        if lettre.isalpha():
            chemin_image = f"../Reverse/{lettre}.gif"
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
        
        output_video_path = f"../frontend/src/assets/output{req_num}.mp4"
        out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'H264'), 10, (target_width, target_height))
        for frame in output_frames:
            out.write(frame)
        out.release()
        print(f"Vidéo créée : {output_video_path}")
        return output_video_path
    else:
        return None

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
        return jsonify({"video_path": video_path})
    else:
        return jsonify({"error": "Erreur lors de la génération de la vidéo"}), 500

#################################################################
##                       Sign To Text Part                     ##
##################################################################

# Load the saved model
model = load_model("./model/asl_alphabet_cnn.h5")

# Define class labels
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

# Initialize MediaPipe Hands
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands.Hands()

def preprocess_frame(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    frame = cv2.resize(frame, (32, 32))  # Resize to target size
    frame = frame / 255.0  # Normalize pixels
    frame = np.expand_dims(frame, axis=-1)  # Add channel dimension
    frame = np.expand_dims(frame, axis=0)  # Add batch dimension
    return frame

@app.route('/detect-sign-language', methods=['POST'])
def detect_sign_language():
    frame = cv2.imdecode(np.frombuffer(request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = mp_hands.process(image)

    letters = []

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            h, w, _ = frame.shape
            x_min = min([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_min = min([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_max = max([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_max = max([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_min, x_max = int(x_min), int(x_max)
            y_min, y_max = int(y_min), int(y_max)

            x_min = max(0, x_min)
            y_min = max(0, y_min)
            x_max = min(w, x_max)
            y_max = min(h, y_max)

            roi = frame[y_min:y_max, x_min:x_max]
            if roi.size != 0:
                processed_roi = preprocess_frame(roi)
                predictions = model.predict(processed_roi)
                predicted_class = labels[np.argmax(predictions)]
                letters.append(predicted_class)

    return jsonify({"letters": letters})

if __name__ == '__main__':
    app.run(debug=True)
