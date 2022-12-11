import { Direction } from '@angular/cdk/bidi';
import { ViewContainerRef } from '@angular/core';

/**
 * Configuration for opening a popup dialog with the PopupService.
 */
export class PopupConfig<D = unknown> {
  /** Affects where the popup will be situated in Angular's logical tree. */
  public viewContainerRef?: ViewContainerRef;


  /** Layout direction for the dialog's content. */
  public direction?: Direction;

  /** ID for the popup. If ommitted, a unique one will be generated. */
  public id?: string;
  /** Custom class for the overlay. */
  public panelClass?: string | string[] = '';
  /** Whether the popup has a backdrop. */
  public hasBackdrop?: boolean;
  /** Class of the backdrop of the popup's overlay */
  public backdropClass?: string;
  /** Whether the popup should close when the backdrop is clicked. */
  public closeOnBackdropClick?: boolean = true;

  /** Data that's available to the instanciated component or template. */
  public data?: D;

  /** Minimal width of the popup */
  public minWidth?: number | string;
  /** Width of the popup */
  public width?: number | string;
  /** Maximal width of the popup */
  public maxWidth?: number | string;

  /** Minimal height of the popup */
  public minHeight?: number | string;
  /** Height of the popup */
  public height?: number | string;
  /** Maximal height of the popup */
  public maxHeight?: number | string;
}
