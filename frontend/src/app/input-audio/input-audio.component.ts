import { Component, Input } from '@angular/core';
import { inputContent } from '../text-tosign/input' ;

@Component({
  selector: 'app-input-audio',
  templateUrl: './input-audio.component.html',
  styleUrl: './input-audio.component.css'
})
export class InputAudioComponent {
  @Input() itemContent!: inputContent ;

}
