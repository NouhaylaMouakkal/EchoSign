from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Activer CORS pour l'application Flask

# Charger le modèle enregistré
model = load_model("asl_alphabet_cnn.h5")

# Définir les étiquettes des classes
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

# Initialiser MediaPipe Hands
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

# Initialiser le module Hands
hands = mp_hands.Hands()

def preprocess_frame(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convertir en niveaux de gris
    frame = cv2.resize(frame, (32, 32))  # Redimensionner à la taille cible
    frame = frame / 255.0  # Normaliser les pixels
    frame = np.expand_dims(frame, axis=-1)  # Ajouter la dimension du canal
    frame = np.expand_dims(frame, axis=0)  # Ajouter la dimension du batch
    return frame

# Liste pour stocker les lettres prononcées
letters = []

@app.route('/detect-sign-language', methods=['POST'])
def detect_sign_language():
    # Lire le cadre de la webcam à partir des données POST
    frame = cv2.imdecode(np.frombuffer(request.files['image'].read(), np.uint8), cv2.IMREAD_COLOR)

    # Convertir l'image en RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Traiter l'image pour détecter les mains
    results = hands.process(image)

    # Vérifier si des mains sont détectées
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Extraire la région d'intérêt (ROI) contenant la main
            h, w, _ = frame.shape
            x_min = min([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_min = min([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_max = max([landmark.x for landmark in hand_landmarks.landmark]) * w
            y_max = max([landmark.y for landmark in hand_landmarks.landmark]) * h
            x_min, x_max = int(x_min), int(x_max)
            y_min, y_max = int(y_min), int(y_max)

            # S'assurer que les coordonnées sont dans les limites de l'image
            x_min = max(0, x_min)
            y_min = max(0, y_min)
            x_max = min(w, x_max)
            y_max = min(h, y_max)

            # Extraire et prétraiter la région d'intérêt (ROI)
            roi = frame[y_min:y_max, x_min:x_max]
            if roi.size != 0:
                processed_roi = preprocess_frame(roi)

                # Faire une prédiction
                predictions = model.predict(processed_roi)
                predicted_class = labels[np.argmax(predictions)]

                # Stocker la lettre prononcée dans la liste
                letters.append(predicted_class)

    return jsonify({"letters": letters})

if __name__ == '__main__':
    app.run(debug=True)
