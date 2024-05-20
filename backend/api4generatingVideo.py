from flask import Flask, request, jsonify
import cv2
import imageio
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def afficher_alphabet(texte, target_width, target_height, delay_between_letters, req_num):
    frames = [] 
    for lettre in texte.lower():
        if lettre.isalpha():
            chemin_image = f"../Reverse/{lettre}.gif"
            if os.path.exists(chemin_image):
                try:
                    animation = imageio.get_reader(chemin_image)
                    for frame in animation:
                        resized_frame = cv2.resize(frame, (target_width, target_height))
                        frames.append(resized_frame)
                except (FileNotFoundError, IndexError) as e:
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
        
        # Write frames to video
        # output_video_path = "./VideoOutput/output.mp4"
        output_video_path = "../frontend/src/assets/output" + str(req_num) + ".mp4"
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

if __name__ == '__main__':
    app.run(debug=True)
