import { Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { SpeechRecognitionService } from "../services/speechrecognition.service";

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css']
})
export class TextTosignComponent {
  
  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;
  messageContent: string = '';
  messages: string[] = [];
  videoSrc: string = '';

  constructor(private videoService: VideoService) {}

  // Clear the conversation
  clearchat(): void {
    this.messages = [];
    this.videoSrc = ''; // Reset video source
  }

  // Send a text message to the backend
  sendMessage(): void {
    if (!this.messageContent.trim()) {
      console.error('Message content is empty');
      return;
    }

    // Add the message to the conversation
    this.messages.push(this.messageContent);

    // Prepare data for the backend
    const data = {
      texte: this.messageContent,
      target_width: 600,
      target_height: 500,
      delay_between_letters: 10,
      req_num: this.messages.length
    };

    // Call the backend to generate the video
    this.videoService.generateVideo(data).subscribe(
      (response) => {
        console.log('Video generated successfully:', response);

        // Check if the backend returned a valid URL
        if (response.video_url) {
          this.videoSrc = response.video_url;

          // Load and play the video
          const videoElement = this.videoPlayer?.nativeElement;
          if (videoElement) {
            videoElement.load();
            videoElement.play();
          }
        } else {
          console.error('No video URL found in the response');
        }
      },
      (error) => {
        console.error('Error generating video:', error);
      }
    );

    // Clear the input field
    this.messageContent = '';
  }

  // Refresh the video player
  refreshVideo(): void {
    const videoElement = this.videoPlayer?.nativeElement;
    if (videoElement) {
      videoElement.load();
      videoElement.play();
    }
  }

  // Example method if you re-introduce speech recognition:
  async startVoiceRecognition() {
    try {
      // const text = await this.speechRecognitionService.recognizeSpeech();
      // this.messageContent = text; // set recognized speech to input field
    } catch (error) {
      console.error('Speech recognition failed:', error);
    }
  }
}