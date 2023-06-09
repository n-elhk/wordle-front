import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { KeyboardService } from '@services/keyboard/keyboard.service';

@Directive({
  selector: 'button[appKeyboard]',
  standalone: true,
})
export class KeyboardDirective {
  /** Injection of {@link KeyboardService}. */
  private keyboardService = inject(KeyboardService);

  /** Injection of {@link ElementRef}. */
  private element = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  @HostListener('click')
  public keyEvent(): void {
    console.log('click')
    this.keyboardService.enterLetter(this.element.nativeElement.value);
  }
}
