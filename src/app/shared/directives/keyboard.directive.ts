import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { KeyboardService } from '@services/keyboard/keyboard.service';

@Directive({
  selector: 'button[appKeyboard]',
  standalone: true,
})
export class KeyboardDirective {
  private keyboardService = inject(KeyboardService);

  private element = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  @HostListener('click')
  public keyEvent(): void {
    this.keyboardService.enterLetter(this.element.nativeElement.value);
  }
}
