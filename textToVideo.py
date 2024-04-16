import cv2
import imageio
import os  # Import the os module

def afficher_alphabet(texte, target_width, target_height):
  """
  Fonction pour afficher les animations GIF des lettres d'un texte donné avec un délai entre chaque lettre et redimensionnement des frames.

  Args:
      texte (str): Le texte à traduire en animations GIF d'alphabet.
      target_width (int): Largeur souhaitée pour les frames.
      target_height (int): Hauteur souhaitée pour les frames.
  """
  for lettre in texte.lower():
    if lettre.isalpha():
      chemin_image = f"Reverse/{lettre}.gif"
      if os.path.exists(chemin_image):
        try:
          animation = imageio.get_reader(chemin_image)
          for frame in animation:
            # Resize the frame
            resized_frame = cv2.resize(frame, (target_width, target_height))
            cv2.imshow(lettre, resized_frame)
            cv2.waitKey(5000)  # Délai de 100 millisecondes après chaque frame
        except (FileNotFoundError, IndexError) as e:
          print(f"Une erreur est survenue : {e}")
      else:
        print(f"Animation GIF introuvable pour la lettre '{lettre}'")
    else:
      print(f"Le caractère '{lettre}' n'est pas une lettre de l'alphabet")

# Exemple d'utilisation
texte = input("Entrez un texte : ")
target_width = 700  # Exemple de largeur souhaitée
target_height = 500 # Exemple de hauteur souhaitée
afficher_alphabet(texte, target_width, target_height)

cv2.destroyAllWindows()  # Fermer toutes les fenêtres à la fin
