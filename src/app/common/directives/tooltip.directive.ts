import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { AwesomeTooltipComponent } from '@components/tooltip.component';

@Directive({
  selector: '[awesomeTooltip]',
  standalone: true,
})
export class AwesomeTooltipDirective {
  /** Injection of {@link Overlay}. */
  private readonly overlay = inject(Overlay);

  /** Injection of {@link OverlayPositionBuilder}. */
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);

  /** Injection of {@link ElementRef}. */
  private readonly elementRef = inject(ElementRef);

  readonly text = input('', { alias: 'awesomeTooltip' });

  readonly disabled = input(false);

  readonly withClick = input(false);

  private overlayRef: OverlayRef | undefined = undefined;

  private get canOpenTooltip() {
    if (!this.disabled() && !this.overlayRef) {
      return true;
    }
    return false;
  }

  private get overlayOption(): FlexibleConnectedPositionStrategy {
    return this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ]);
  }

  public show(): void {
    if (!this.canOpenTooltip) {
      return;
    }

    const positionStrategy = this.overlayOption;

    this.overlayRef = this.overlay.create({ positionStrategy });

    const tooltipRef = this.overlayRef.attach(
      new ComponentPortal(AwesomeTooltipComponent)
    );
    tooltipRef.instance.text = this.text();
  }

  @HostListener('mouseenter')
  private showlistner(): void {
    if (this.withClick() || !this.canOpenTooltip) {
      return;
    }
    this.show();
  }

  @HostListener('mouseout')
  public hide(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef = undefined;
  }
}
