import { Component, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { ToastData, ToastConfig, TOAST_CONFIG, TOAST_DATA } from './toast-config';
import { ToastRef } from './toast-ref';
import { ToastAnimation, toastAnimations } from './toast-animation';
import { map, timer, merge, of, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['toast.component.scss'],
  imports: [
    CommonModule,
  ],
  standalone: true,
  animations: [toastAnimations.fadeToast],
})
export class ToastComponent {

  protected animationState$ = merge(
    of(ToastAnimation.Default),
    timer(5000).pipe(
      map(() => 'closing' as ToastAnimation.Closing),
    ),
  );

  constructor(
    private readonly ref: ToastRef,
    @Inject(TOAST_CONFIG) protected toastConfig: ToastConfig,
    @Inject(TOAST_DATA) protected data: ToastData,
  ) { }

  close(): void {
    this.ref.close();
  }

  async onFadeFinished(event: AnimationEvent): Promise<void> {
    const { toState } = event;
    const isFadeOut = (toState as ToastAnimation) === ToastAnimation.Closing;
    const itFinished = await firstValueFrom(this.animationState$) === ToastAnimation.Closing;

    if (isFadeOut || itFinished) {
      this.close();
    }
  }
}
