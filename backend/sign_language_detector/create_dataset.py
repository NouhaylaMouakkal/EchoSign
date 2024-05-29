import os
import pickle

import mediapipe as mp
import cv2

# Initialize mediapipe hands solution
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

DATA_DIR = './data'

data = []
labels = []

# Ensure we are processing only directories
for dir_ in os.listdir(DATA_DIR):
    dir_path = os.path.join(DATA_DIR, dir_)
    if os.path.isdir(dir_path):  # Check if it is a directory
        for img_path in os.listdir(dir_path):
            img_full_path = os.path.join(dir_path, img_path)
            if os.path.isfile(img_full_path):  # Check if it is a file
                data_aux = []
                x_ = []
                y_ = []

                img = cv2.imread(img_full_path)
                if img is None:
                    print(f"Warning: Unable to read image {img_full_path}")
                    continue

                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = hands.process(img_rgb)

                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        for i in range(len(hand_landmarks.landmark)):
                            x = hand_landmarks.landmark[i].x
                            y = hand_landmarks.landmark[i].y
                            x_.append(x)
                            y_.append(y)

                        for i in range(len(hand_landmarks.landmark)):
                            x = hand_landmarks.landmark[i].x
                            y = hand_landmarks.landmark[i].y
                            data_aux.append(x - min(x_))
                            data_aux.append(y - min(y_))

                    if data_aux:
                        data.append(data_aux)
                        labels.append(dir_)
                    else:
                        print(f"Warning: No landmarks found for image {img_full_path}")

print(f"Total samples collected: {len(data)}")
print(f"Total labels collected: {len(labels)}")

if len(data) == 0:
    print("Error: No data collected. Please check the image files and landmarks detection.")
else:
    # Save the data to a pickle file
    with open('data.pickle', 'wb') as f:
        pickle.dump({'data': data, 'labels': labels}, f)

    print("Data collection completed and saved to 'data.pickle'.")
