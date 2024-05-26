import { Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { SpeechRecognitionService } from "../services/speechrecognition.service";

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css']
})
export class TextTosignComponent {
  @ViewChild('videoPlayer') videoPlayer?: ElementRef;
  messageContent: string = '';
  messages: string[] = [];
  videoSrc: string = '';

  constructor(public videoService: VideoService, private speechRecognitionService: SpeechRecognitionService) { }

  clearchat() {
    this.messages = [];
  }

  sendMessage() {
    if (this.messageContent.trim() !== '') {
      this.messages.push(this.messageContent);
      const data = {
        texte: this.messageContent,
        target_width: 600,
        target_height: 500,
        delay_between_letters: 10,
        req_num: this.messages.length
      };

      this.videoService.generateVideo(data).subscribe(
        response => {
          console.log('Video generated successfully', response);
          this.refreshVideo();
        },
        error => {
          console.error('Error generating video', error);
        }
      );
      this.messageContent = '';
    }
  }

  refreshVideo() {
    this.videoSrc = `assets/output${this.messages.length}.mp4`;
    if (this.videoPlayer) {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      video.load();
      video.play();
    }
  }

  async startVoiceRecognition() {
    try {
      const text = await this.speechRecognitionService.recognizeSpeech();
      this.messageContent = text; // Display the detected speech in the input field
    } catch (error) {
      console.error('Speech recognition failed: ', error);
    }
  }
}
