import { Component, ViewChild, ElementRef } from '@angular/core';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] 
})

export class TextTosignComponent {

  constructor(public  videoService: VideoService) { }


  messageContent: string = '' ;
  messages: string[] = [] ;
  videoSrc: string = "assets/output" + this.messages.length + ".mp4" ; 


  @ViewChild('videoPlayer') videoPlayer?: ElementRef ;
  video: HTMLVideoElement = this.videoPlayer?.nativeElement ; 
  
  //to clear a chat
  clearchat() {
      this.messages = [];
  }
  //to send a message
  sendMessage() {
    
    if (this.messageContent.trim() !== '') {
      //add to the messages array to display the message in the conversation
      this.messages.push(this.messageContent);
      
      


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

      // this.videoService.generateVideo(data)
      // .then( (result)=>{
      //   console.log('Video generated successfully', result);
      //   this.refreshVideo();
      // })
      // .catch((err)=>{
      //   console.error('Error generating video', err);
      // });


      

      //clear the input text field
      this.messageContent = '';
    }

  }


  refreshVideo() {
    
    this.videoSrc = "assets/output" + this.messages.length + ".mp4";
    this.video = this.videoPlayer?.nativeElement ; 

    // this.videoSrc = 'path/to/output1.mp4'; // Update source after generation
    this.video.load(); // Trigger video reload
    this.video.play(); // Optionally play the video
  }

  refreshVid(){
    const video: HTMLVideoElement = this.videoPlayer?.nativeElement ; 

    // this.videoSrc = 'path/to/output1.mp4'; // Update source after generation
    this.video.load(); // Trigger video reload
    this.video.play(); // Optionally play the video
  }

  

}

// generateVideo() {
  //   if (this.messageContent.trim() !== '') {
  //     this.http.post<any>('/generate-video', {
  //       texte: this.messageContent,
  //       target_width: 600, 
  //       target_height: 500, 
  //       delay_between_letters: 10 
  //     }).subscribe(
  //       (data) => {
  //         this.videoPath = data.video_path;
  //       },
  //       (error) => {
  //         console.error('Erreur lors de la génération de la vidéo :', error);
  //       }
  //     );
  //     this.messages.push(this.messageContent);
  //     this.messageContent = '';
  //   }
  // }