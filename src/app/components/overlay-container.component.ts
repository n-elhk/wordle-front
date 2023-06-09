import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  PortalModule,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  ViewChild,
  ViewEncapsulation,
  HostBinding,
  OnDestroy,
  inject,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * This error is thrown when trying to attach a portal when another
 * is already attached.
 */
class ContentIsAlreadyAttachedError extends Error {
  constructor() {
    super(
      `Attempting to attach popup content after content is already attached`
    );
  }
}

/**
 * This component is not meant for direct use. Insead, it is used internally
 * by the PopupService. It acts as an Outlet that the service can attach
 * a Portal to.
 */
@Component({
  selector: 'overlay-container',
  imports: [PortalModule],
  template: `<ng-template cdkPortalOutlet></ng-template>`,
  styles: [
    `
      overlay-container {
        position: relative;
        overflow-y: auto;
        background-color: var(--secondary-color);
        color: var(--text-color);
        border-radius: 4px;
        width: 100%;
        padding: 1rem 1.2rem;
      }
    `,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class OverlayContainerComponent
  extends BasePortalOutlet
  implements AfterViewInit, OnDestroy
{
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Reference to the portal outlet.
   */
  @ViewChild(CdkPortalOutlet, { static: true })
  private portalOutlet!: CdkPortalOutlet;

  /**
   * Id of the popup container.
   */
  @HostBinding() public id!: string;

  /** A subject that fires right after the popup has finished opening. */
  public readonly afterViewInit$ = new ReplaySubject<void>(1);

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    this.afterViewInit$.next();
  }

  /** @inheritdoc */
  public ngOnDestroy(): void {
    this.afterViewInit$.complete();
  }

  /**
   * @returns The ElementRef of the host.
   */
  public getHost(): HTMLElement {
    return this.host.nativeElement;
  }

  /**
   * @returns The direct children of the host.
   */
  public getInsertedElements(): HTMLElement[] {
    const hostElement = this.host.nativeElement;

    return Array.from(hostElement.children) as HTMLElement[];
  }

  /**
   * Attaches a ComponentPortal to the PortalOutlet.
   *
   * @param portal A ComponentPortal.
   * @returns The inserted component's reference.
   */
  public attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this.portalOutlet.hasAttached()) {
      throw new ContentIsAlreadyAttachedError();
    }

    return this.portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attaches a TemplatePortal to the PortalOutlet.
   *
   * @param portal A TemplatePortal.
   * @returns The inserted EmbeddedView.
   */
  public attachTemplatePortal<C>(
    portal: TemplatePortal<C>
  ): EmbeddedViewRef<C> {
    if (this.portalOutlet.hasAttached()) {
      throw new ContentIsAlreadyAttachedError();
    }

    return this.portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * Attaches a DomPortal to the PortalOutlet.
   *
   * @param portal A DomPortal.
   */
  public attachDOMPortal(portal: DomPortal): void {
    if (this.portalOutlet.hasAttached()) {
      throw new ContentIsAlreadyAttachedError();
    }

    this.portalOutlet.attachDomPortal(portal);
    return;
  }
}
