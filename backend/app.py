from flask import Flask, request, jsonify, send_from_directory
import logging
import cv2
import imageio
import os
from io import BytesIO
from flask_cors import CORS
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model
from azure.storage.blob import BlobServiceClient
import uuid
from dotenv import load_dotenv

# Charger les variables depuis le fichier .env
load_dotenv()

# Configuration pour Azure Blob Storage
AZURE_CONNECTION_STRING = os.getenv("AZURE_CONNECTION_STRING")
if not AZURE_CONNECTION_STRING:
    raise ValueError("La clé Azure Storage n'est pas configurée.")

BLOB_CONTAINER_NAME = "videos"

# Client Azure Blob Storage
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)


app = Flask(__name__)
CORS(app)

#################################################################
##                       Text To Sign Part                     ##
#################################################################

def afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num):
    """
    Génère une vidéo à partir du texte fourni en combinant des GIF correspondant aux lettres.
    """
    try:
        frames = []
        for lettre in texte.lower():
            if lettre.isalpha():
                chemin_image = f"./Reverse/{lettre}.gif"
                if os.path.exists(chemin_image):
                    animation = imageio.get_reader(chemin_image)
                    for frame in animation:
                        resized_frame = cv2.resize(np.array(frame), (target_width, target_height))
                        frames.append(resized_frame)
                else:
                    print(f"GIF introuvable pour la lettre '{lettre}'")
            else:
                print(f"Caractère non pris en charge : '{lettre}'")

        if frames:
            output_frames = [frame for frame in frames for _ in range(delay_between_letters)]
            
            # Generate a unique filename
            output_video_path = f"/tmp/videos/output_{req_num}_{uuid.uuid4().hex}.avi"

            # Use MJPG codec for better compatibility
            fourcc = cv2.VideoWriter_fourcc(*'MJPG')
            out = cv2.VideoWriter(
                output_video_path,
                fourcc,
                10,
                (target_width, target_height)
            )

            if not out.isOpened():
                raise ValueError("Failed to initialize VideoWriter with MJPG codec")
            
            for frame in output_frames:
                out.write(frame)
            out.release()
            print(f"Vidéo créée dans le répertoire monté : {output_video_path}")
            return output_video_path
        else:
            print("Aucun frame généré, vérifiez le texte d'entrée.")
            return None
    except Exception as e:
        print(f"Erreur lors de la génération de la vidéo : {e}")
        return None


def generate_unique_name(req_num):
    """
    Génère un nom unique pour les fichiers basés sur un UUID.
    """
    unique_id = uuid.uuid4().hex
    return f"output_{req_num}_{unique_id}.mp4"


def upload_to_blob(local_file_path, blob_name):
    """
    Téléverse un fichier local vers Azure Blob Storage et retourne son URL publique.
    """
    try:
        container_client = blob_service_client.get_container_client(BLOB_CONTAINER_NAME)

        if not container_client.exists():
            raise ValueError(f"Le conteneur '{BLOB_CONTAINER_NAME}' n'existe pas.")

        print(f"Téléversement du fichier {local_file_path} > {blob_name}...")

        with open(local_file_path, "rb") as data:
            container_client.upload_blob(name=blob_name, data=data, overwrite=True)

        blob_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{BLOB_CONTAINER_NAME}/{blob_name}"
        print(f"Téléversement réussi : {blob_url}")
        return blob_url

    except Exception as e:
        print(f"Erreur lors du téléversement vers Azure Blob Storage : {e}")
        return None





@app.route('/', methods=['GET'])
def test():
    """
    Endpoint de test pour vérifier que le backend fonctionne.
    """
    return jsonify({"message": "BACKEND WORKS"}), 200

@app.route('/code', methods=['GET'])
def code():
    return jsonify({"code": + AZURE_CONNECTION_STRING}), 200


@app.route('/generate-video', methods=['POST'])
def generate_video():
    logging.basicConfig(level=logging.DEBUG)
    try:
        data = request.json
        texte = data.get('texte', "").strip()
        if not texte:
            return jsonify({"error": "Le champ 'texte' est requis."}), 400

        target_width = data.get('target_width', 600)
        target_height = data.get('target_height', 500)
        delay_between_letters = data.get('delay_between_letters', 10)
        req_num = data.get('req_num', 1)

        print(f"Received request to generate video: texte='{texte}', target_width={target_width}, target_height={target_height}")

        # Generate the video in the mounted directory
        local_video_path = afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num)
        if not local_video_path:
            return jsonify({"error": "Erreur lors de la génération de la vidéo"}), 500

        # Generate a unique blob name
        blob_name = os.path.basename(local_video_path)
        print(f"Generated unique blob name: {blob_name}")

        # Upload directly to Azure Blob Storage
        video_url = upload_to_blob(local_video_path, blob_name)

        # Clean up the file in /tmp/videos (optional)
        if os.path.exists(local_video_path):
            os.remove(local_video_path)
            print(f"Deleted local video file: {local_video_path}")

        if video_url:
            return jsonify({"video_url": video_url}), 200
        else:
            return jsonify({"error": "Erreur lors du téléversement de la vidéo"}), 500
    except Exception as e:
        print(f"Erreur dans '/generate-video': {e}")
        return jsonify({"error": "Erreur serveur interne"}), 500



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