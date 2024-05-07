import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] 
})
export class TextTosignComponent {
  messageContent: string = '';
  messages: string[] = [];
  videoPath: string = '';

  constructor(private http: HttpClient) {}

  generateVideo() {
    if (this.messageContent.trim() !== '') {
      this.http.post<any>('/generate-video', {
        texte: this.messageContent,
        target_width: 600, 
        target_height: 500, 
        delay_between_letters: 10 
      }).subscribe(
        (data) => {
          this.videoPath = data.video_path;
        },
        (error) => {
          console.error('Erreur lors de la génération de la vidéo :', error);
        }
      );
      this.messages.push(this.messageContent);
      this.messageContent = '';
    }
  }
}
