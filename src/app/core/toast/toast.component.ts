import { Component, inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { TOAST_CONFIG, TOAST_DATA } from './toast-config';
import { ToastRef } from './toast-ref';
import { ToastAnimation, toastAnimations } from './toast-animation';
import { map, timer, merge, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'wd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['toast.component.scss'],
  standalone: true,
  animations: [toastAnimations.fadeToast],
})
export class ToastComponent {
  private readonly ref = inject(ToastRef);
  readonly toastConfig = inject(TOAST_CONFIG);
  readonly data = inject(TOAST_DATA);

  private readonly animationState$ = merge(
    of(ToastAnimation.Default),
    timer(5000).pipe(map(() => 'closing' as ToastAnimation.Closing))
  );

  readonly animationState = toSignal(this.animationState$, {
    requireSync: true,
  });

  close(): void {
    this.ref.close();
  }

  async onFadeFinished(event: AnimationEvent): Promise<void> {
    const { toState } = event;
    const isFadeOut = (toState as ToastAnimation) === ToastAnimation.Closing;
    const itFinished = this.animationState() === ToastAnimation.Closing;

    if (isFadeOut || itFinished) {
      this.close();
    }
  }
}
