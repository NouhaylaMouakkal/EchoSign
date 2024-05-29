import { Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';
import { SpeechRecognitionService } from "../services/speechrecognition.service";

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] 
})

export class TextTosignComponent {
  constructor(public  videoService: VideoService, private speechRecognitionService: SpeechRecognitionService) { }

  @ViewChild('videoPlayer') videoPlayer?: ElementRef ;
  video: HTMLVideoElement = this.videoPlayer?.nativeElement ; 
  messageContent: string = '' ;
  messages: string[] = [] ;
  videoSrc: string = "assets/videosOutput/output" + this.messages.length + ".mp4" ; 

  //to clear a chat
  clearchat() {
      this.messages = [];
  }

  //to send a message
  sendMessage() {
    if (this.messageContent.trim() !== '') {
      //add to the messages array to display the message in the conversation
      this.messages.push(this.messageContent);
      //prepare our data ro send it to the backend
      const data = {
        texte: this.messageContent,
        target_width: 600,
        target_height: 500,
        delay_between_letters: 10,
        req_num : this.messages.length
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
    this.videoSrc = "assets/videosOutput/output" + this.messages.length + ".mp4";
    this.video = this.videoPlayer?.nativeElement ; 
    this.video.load(); // Trigger video reload
    this.video.play(); // Optionally play the video
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
