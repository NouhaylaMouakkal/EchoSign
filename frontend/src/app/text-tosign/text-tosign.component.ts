import { Component } from '@angular/core';

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] 
})
export class TextTosignComponent {
  messageContent: string = '';
  messages: string[] = [];

  sendMessage() {
    if (this.messageContent.trim() !== '') {
      this.messages.push(this.messageContent);
      this.messageContent = '';
    }
  }
}
