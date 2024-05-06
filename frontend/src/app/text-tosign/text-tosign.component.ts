import { Component } from '@angular/core';
import { inputContent } from './input'; // Assuming inputContent is properly defined in './input'

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] // Corrected property name
})
export class TextTosignComponent {
  messageContent: string = '';
  messages: string[] = [];

  sendMessage() {
    if (this.messageContent.trim() !== '') {
      this.messages.push(this.messageContent);
      this.messageContent = ''; // Clear input
    }
  }
}
