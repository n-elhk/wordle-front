import { Directive, HostListener } from '@angular/core';
import { KeyboardService } from '../services/keyboard/keyboard.service';

@Directive({
  selector: '[appKeyboard]'
})
export class KeyboardDirective {


  constructor(
    private keyboardService: KeyboardService,
  ) {}

  @HostListener('click', ['$event'])
  keyEvent(ev: PointerEvent) {
    this.keyboardService.enterLetter((ev.target as HTMLButtonElement).value).subscribe();
  }

}
