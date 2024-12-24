import { Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { SpeechRecognitionService } from "../services/speechrecognition.service";
import Swal from 'sweetalert2';


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

    // SweetAlert Toast configuration
    private Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

  constructor(private videoService: VideoService) {}

  // Clear the conversation
  clearchat(): void {
    this.messages = [];
    this.videoSrc = '';
  }

  // Send a text message to the backend
  sendMessage(): void {
    if (!this.messageContent.trim()) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please enter a message to translate!'
      });
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

          // Load the video and set up safe playback
          const videoElement = this.videoPlayer?.nativeElement;
          if (videoElement) {
            videoElement.oncanplay = () => videoElement.play(); // Play only when the video is ready
            videoElement.src = this.videoSrc; // Set the video source
          }

          // Show success alert
          this.Toast.fire({
            icon: 'success',
            title: 'Video generated successfully!'
          });
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
      videoElement.oncanplay = () => videoElement.play(); // Play only when ready
      videoElement.load(); // Reload the video
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