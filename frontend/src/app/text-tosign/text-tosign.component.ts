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
  videoSrc: string = '';  // We'll set this dynamically from the backend response

  constructor(
    private videoService: VideoService,
    private speechRecognitionService: SpeechRecognitionService
  ) {}

  // Clear the conversation
  clearchat() {
    this.messages = [];
  }

  // Send a text message to the backend
  sendMessage() {
    if (this.messageContent.trim() !== '') {
      // Append the message to our local array for display
      this.messages.push(this.messageContent);

      // Prepare the data to send to the backend
      const data = {
        texte: this.messageContent,
        target_width: 600,
        target_height: 500,
        delay_between_letters: 10,
        req_num: this.messages.length
      };

      // Call our backend to generate the video
      this.videoService.generateVideo(data).subscribe(
        (response) => {
          console.log('Video generated successfully:', response);

          // The backend might respond with something like:
          // { "video_url": "http://<backend-domain>/videos/output1.mp4" }
          if (response.video_url) {
            // Update our videoSrc property
            this.videoSrc = response.video_url;

            // Force the video element to reload and optionally start playing
            if (this.videoPlayer?.nativeElement) {
              const vidElem = this.videoPlayer.nativeElement;
              vidElem.load();
              vidElem.play();
            }
          } else {
            console.error('No "video_url" found in response');
          }
        },
        (error) => {
          console.error('Error generating video:', error);
        }
      );

      // Clear the input
      this.messageContent = '';
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