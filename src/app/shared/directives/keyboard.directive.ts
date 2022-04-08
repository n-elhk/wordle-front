import { Attribute, Directive, HostListener } from '@angular/core';
import { KeyboardService } from '../../core/services/keyboard/keyboard.service';

@Directive({
  selector: '[appKeyboard]'
})
export class KeyboardDirective {

  constructor(
    private keyboardService: KeyboardService,
    @Attribute('appKeyboard') private appKeyboard: string,
  ) { }

  @HostListener('click')
  public keyEvent(): void {
    this.keyboardService.enterLetter(this.appKeyboard);
  }
  

}
