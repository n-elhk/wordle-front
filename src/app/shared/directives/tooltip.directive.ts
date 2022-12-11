import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AwesomeTooltipComponent } from '@shared/components/tooltip.component';

@Directive({
  selector: '[awesomeTooltip]',
  standalone: true,
})
export class AwesomeTooltipDirective {

  @Input('awesomeTooltip') public text = '';
  @Input() public disabled = false;

  private overlayRef!: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
  ) { }

  public ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  public show(): void {
    if (this.disabled) { return; }
    const tooltipRef = this.overlayRef.attach(new ComponentPortal(AwesomeTooltipComponent));
    tooltipRef.instance.text = this.text;
  }

  @HostListener('mouseout')
  public hide(): void {
    if(this.overlayRef.hasAttached()){
      this.overlayRef.detach();
    }
  }
}
