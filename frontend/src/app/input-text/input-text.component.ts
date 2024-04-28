import { Component, Input } from '@angular/core';
import { inputContent } from '../text-tosign/input';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css'
})
export class InputTextComponent {
  @Input() itemContent! : inputContent ;
}
