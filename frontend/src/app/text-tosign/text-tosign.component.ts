import { Component } from '@angular/core';
import { inputContent } from './input'; // Assuming inputContent is properly defined in './input'

@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrls: ['./text-tosign.component.css'] // Corrected property name
})
export class TextTosignComponent {
  messages: any[] = []; // Declare 'messages' property
  messageChat: string = ''; // Declare 'messageChat' property

  // Declare 'send' method
  send() {
    if (this.messageChat.trim() !== '') {
      this.messages.push(this.messageChat); // Add the message to the messages array
      this.messageChat = ''; // Clear the input field after sending
    }
  }
}
