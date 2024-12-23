# Step 1: Use a lightweight Python image
FROM python:3.12-slim

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Install system dependencies required for OpenCV and video encoding
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libx264-dev \
    ffmpeg \
    libavcodec-extra \
    && rm -rf /var/lib/apt/lists/*

# Step 4: Copy application files to the container
COPY . /app

# Ensure the 'Reverse' folder is included
COPY Reverse /app/Reverse

# Step 4.1: Create a folder where we will store generated videos
RUN mkdir -p /app/videos

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Expose the Flask application's port
EXPOSE 2002

# Step 7: Command to run the application (using Gunicorn)
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:2002", "app:app"]