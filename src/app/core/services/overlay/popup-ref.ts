import { OverlayRef } from '@angular/cdk/overlay';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { filter, Observable, Subject, tap, first } from 'rxjs';

import { OverlayContainerComponent } from '../../../shared/components/overlay-container.component';

let uniqueId = 0;

/**
 * When a Popup is opened, it's embedded inside of a PopupContainer
 * which itself is embedded within a CdkOverlay.
 * This class holds references to both the overlay, the PopupContainer
 * and the component instance (if any), and exposes a few useful methods
 * and properties to the code that consumes it.
 *
 * @typedef T The type of the created Component, if any.
 * @typedef R The type of the events passed through the afterClosed$
 * observable.
 */
export class PopupRef<T, R = unknown> {
  /** The current result of the popup. */
  private result: R | undefined = undefined;
  /** A subject that fires right after the popup has finished opening. */
  private readonly afterViewInitSubject = new Subject<void>();
  /** A subject that fires right before the popup has started closing. */
  private readonly beforeClosedSubject = new Subject<R | undefined>();
  /** A subject that fires just after the popup has finished being closed. */
  private readonly afterClosedSubject = new Subject<R | undefined>();

  /** A reference to the instanciated component if the popup was opened with one (instead of a TemplateRef). */
  public componentInstance: T | undefined = undefined;
  /** An observable that fires right after the popup has view initialized. */
  public readonly afterViewInit$ = this.afterViewInitSubject.asObservable();
  /** An observable that fires right before the popup has started closing. */
  public readonly beforeClosed$ = this.beforeClosedSubject.asObservable();
  /** An observable that fires just after the popup has finished being closed. */
  public readonly afterClosed$ = this.afterClosedSubject.asObservable();

  constructor(
    private overlayRef: OverlayRef,
    private popupContainerInstance: OverlayContainerComponent,
    private closeOnBackdropClick = false,
    id = `crm-popup-${ uniqueId++ }`,
  ) {
    this.popupContainerInstance.id = id;
    this.popupContainerInstance.afterViewInit$.pipe(
      first(),
      tap(() => {
        this.afterViewInitSubject.next();
        this.afterViewInitSubject.complete();
      }),
    ).subscribe();

    this.overlayRef.detachments().pipe(
      tap(() => {
        this.beforeClosedSubject.next(this.result);
        this.beforeClosedSubject.complete();
        this.afterClosedSubject.next(this.result);
        this.afterClosedSubject.complete();
        this.componentInstance = null as never;
        this.overlayRef.dispose();
      }),
    ).subscribe();

    this.overlayRef.keydownEvents().pipe(
      filter(event => event.code === 'ESCAPE' && !hasModifierKey(event)),
      tap(event => {
        event.preventDefault();
        this.close();
      }),
    ).subscribe();

    if (this.closeOnBackdropClick) {
      this.overlayRef.backdropClick().pipe(
        tap(() => this.close()),
      ).subscribe();
    }
  }

  /**
   * Closes the popup instance.
   *
   * @param popupResult The result of the popup that will be passed
   * through the beforeClosed and afterClosed observables.
   */
  public close(popupResult?: R): void {
    this.result = popupResult;
    this.beforeClosedSubject.next(popupResult);
    this.beforeClosedSubject.complete();
    this.overlayRef.detachBackdrop();
    this.overlayRef.dispose();
  }

  /** @returns An observable that emits when the backdrop has been clicked. */
  public backdropClick(): Observable<MouseEvent> {
    return this.overlayRef.backdropClick();
  }

  /**
   * Updates the size properties of the overlay.
   *
   * @param width The new width of the overlay panel.
   * @param height The new height of the overlay panel.
   * @returns The PopupRef instance.
   */
  public updateSize(width = '', height = ''): this {
    this.overlayRef.updateSize({ width, height });
    this.overlayRef.updatePosition();
    return this;
  }

  /**
   * Returns if the popup is attached (i.e. displayed on the screen)
   *
   * @returns Boolean value if the popup is attached or not
   */
  public hasAttached(): boolean {
    return this.overlayRef.hasAttached();
  }

  /**
   * Get the host element of the popup
   *
   * @returns The HTML container of the popup
   */
  public getHostElement(): HTMLElement {
    return this.overlayRef.hostElement;
  }
}
