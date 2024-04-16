import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils 
mp_hands = mp.solutions.hands

# Initialize VideoCapture
cap = cv2.VideoCapture(0)

# Initialize hands module
hands = mp_hands.Hands()

while True:
    # Read frame from the camera
    ret, frame = cap.read()
    if not ret:
        break

    # Convert the image to RGB
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the image to detect hands
    results = hands.process(image)

    # Check if hands are detected
    if results.multi_hand_landmarks:
        # Iterate through each detected hand
        for hand_landmarks in results.multi_hand_landmarks:
            # Draw landmarks and connections on the image
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    # Convert the image back to BGR
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Display the image with hand landmarks
    cv2.imshow("Hand Tracking", image)

    # Check for key press and exit if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release VideoCapture and close all windows
cap.release()
cv2.destroyAllWindows()
