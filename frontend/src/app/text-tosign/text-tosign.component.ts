import { Component, OnInit } from '@angular/core';
import { inputContent } from './input';




@Component({
  selector: 'app-text-tosign',
  templateUrl: './text-tosign.component.html',
  styleUrl: './text-tosign.component.css'
})

export class TextTosignComponent{

  inputContent: inputContent[] = [
    {
      id: '1',
      sender: 'Alice',
      text: 'Hello, how are you?',
      source: '',
      isText: true,
    },
    {
      id: '2',
      sender: 'Bob',
      text: 'Hi Alice, I am doing well. Thanks for asking!',
      source: '',
      isText: true,
    },
    {
      id: '3',
      sender: 'Alice',
      text: '',
      source: 'audio1.mp3',
      isText: false,
    },
    {
      id: '4',
      sender: 'Bob',
      text: '',
      source: 'audio2.mp3',
      isText: false,
    },
  ];

  


  

}


