import cv2
import imageio
import os
import moviepy.editor as mp

def afficher_alphabet(texte, target_width, target_height, delay_between_letters):
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
        output_video_path = "./VideoOutput/alphabet_animation.mp4"
        out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), 10, (target_width, target_height))
        for frame in output_frames:
            out.write(frame)
        out.release()
        print(f"Vidéo créée : {output_video_path}")

# Exemple d'utilisation
texte = input("Entrez un texte : ")
target_width = 700  
target_height = 500 
delay_between_letters = 20  # Delay in number of frames
afficher_alphabet(texte, target_width, target_height, delay_between_letters)
