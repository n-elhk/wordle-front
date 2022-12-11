import { Attribute, Directive, HostListener, inject, Input } from '@angular/core';
import { KeyboardService } from '../../core/services/keyboard/keyboard.service';

@Directive({
  selector: 'button[appKeyboard]',
  standalone: true,
})
export class KeyboardDirective {
  private keyboardService = inject(KeyboardService);

  @Input() public appKeyboard!: string;

  @HostListener('click')
  public keyEvent(): void {
    this.keyboardService.enterLetter(this.appKeyboard);
  }


}
