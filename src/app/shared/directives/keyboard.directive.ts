import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { KeyboardService } from '@services/keyboard/keyboard.service';

@Directive({
  selector: 'button[appKeyboard]',
  standalone: true,
})
export class KeyboardDirective {
  private keyboardService = inject(KeyboardService);

  constructor(private el: ElementRef<HTMLButtonElement>) {}

  @HostListener('click')
  public keyEvent(): void {
    this.keyboardService.enterLetter(this.el.nativeElement.value);
  }
}
