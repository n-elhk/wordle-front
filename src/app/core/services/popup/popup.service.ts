import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  Injectable,
  InjectionToken,
  Injector,
  TemplateRef,
  StaticProvider,
  inject,
} from '@angular/core';
import { of } from 'rxjs';

import { PopupConfig } from './popup-config';
import { PopupRef } from './popup-ref';
import { OverlayContainerComponent } from '@components/overlay-container.component';

export const POPUP_DATA = new InjectionToken<unknown>('PopupData');
export const DEFAULT_POPUP_CONFIG = new InjectionToken<unknown>(
  'DEFAULT_POPUP_CONFIG'
);

/**
 * This services exposes an API to open popups and manage them easily.
 */
@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  /** Injection of {@link PopupConfig }. */
  private defaultOptions = inject<PopupConfig | undefined>(
    DEFAULT_POPUP_CONFIG,
    { optional: true }
  );

  /** Injection of {@link Overlay}. */
  private overlay = inject(Overlay);

  /** Injection of {@link Injector}. */
  private injector = inject(Injector);

  /**
   * Opens a popup within an overlay.
   *
   * @param templateRefOrCmpClass Either a Component class, or a TemplateRef
   * @param config A configuration object that will be merged with a default
   * configuration object.
   * @returns A PopupRef, which is an object that exposes useful methods to
   * interact with the popup and the view that is hosted within it.
   * @template T The static type of the component to instantiate.
   * @template D The data type passed to the component or template.
   * @template R The result type of the popup.
   */
  public open<T, D = unknown, R = unknown>(
    templateRefOrCmpClass: ComponentType<T> | TemplateRef<T>,
    config?: PopupConfig<D>
  ): PopupRef<T, R> {
    config = this.mergeWithDefaultConfig(
      config,
      this.defaultOptions || new PopupConfig()
    );
    const overlayRef = this.createOverlay(config),
      popupContainer = this.attachPopupContainer(overlayRef, config),
      popupRef = this.attachPopupContent<T, R>(
        templateRefOrCmpClass,
        popupContainer,
        overlayRef,
        config
      );

    console.info(`OverlayService.Open: open overlay.`);
    return popupRef;
  }

  /**
   * Fuses two popup configuration objects with one another.
   * Properties of the first parameter will overwrite properties
   * of the second parameter.
   *
   * @param config A Popup configuration object.
   * @param defaultOptions A popup Configuration object.
   * @returns Another Popup configuration object.
   */
  private mergeWithDefaultConfig<A>(
    config?: PopupConfig<A>,
    defaultOptions?: PopupConfig
  ): PopupConfig<A> {
    return { ...defaultOptions, ...config } as PopupConfig<A>;
  }

  /**
   * Creates an overlay corresponding to given popup configuration object.
   *
   * @param config Popup configuration object.
   * @returns A reference to the created overlay.
   */
  private createOverlay(config: PopupConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);

    return this.overlay.create(overlayConfig);
  }

  /**
   * Attaches a PopupContainer to an existing Overlay.
   *
   * @remarks
   * The PopupContainer is created by instanciating a ComponentPortal.
   * @param overlay An Overlay reference.
   * @param config Popup configuration object.
   * @returns A PopupContainerComponent
   */
  private attachPopupContainer(
    overlay: OverlayRef,
    config?: PopupConfig
  ): OverlayContainerComponent {
    const userInjector = config?.viewContainerRef?.injector;
    const injector = Injector.create({
      parent: userInjector ?? this.injector,
      providers: [
        {
          provide: POPUP_DATA,
          useValue: config,
        },
      ],
    });
    const dialogContainerPortal = new ComponentPortal(
      OverlayContainerComponent,
      config?.viewContainerRef,
      injector
    );
    const containerRef = overlay.attach(dialogContainerPortal);

    return containerRef.instance;
  }

  /**
   * Instanciates a PopupRef by creating a portal with it, and then
   * attaching this portal to the PopupContainer's PortalOutlet.
   *
   * @param componentOrTemplateRef A Component class or a TemplateRef.
   * @param popupContainer An instance of PopupContainerComponent.
   * @param overlayRef A reference to an existing Overlay.
   * @param config A Popup configuration object.
   * @returns A PopupRef object.
   */
  private attachPopupContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    popupContainer: OverlayContainerComponent,
    overlayRef: OverlayRef,
    config: PopupConfig
  ): PopupRef<T, R> {
    const popupRef = new PopupRef<T, R>(
      overlayRef,
      popupContainer,
      config.closeOnBackdropClick,
      config.id
    );

    if (componentOrTemplateRef instanceof TemplateRef) {
      popupContainer.attachTemplatePortal(
        new TemplatePortal<T>(
          componentOrTemplateRef,
          null as never,
          {
            $implicit: config.data,
            popupRef,
          } as unknown as T
        )
      );
    } else {
      const injector = this.createInjector(config, popupRef, popupContainer);
      const contentRef = popupContainer.attachComponentPortal(
        new ComponentPortal(
          componentOrTemplateRef,
          config.viewContainerRef,
          injector
        )
      );

      popupRef.componentInstance = contentRef.instance;
    }

    return popupRef;
  }

  /**
   * Generates an overlay configuration from the provided popup configuration.
   *
   * @param config The popup configuration.
   * @returns The overlay configuration.
   */
  private getOverlayConfig(config: PopupConfig): OverlayConfig {
    /** block make visible scroll bar. */
    const scrollStrategy = this.overlay.scrollStrategies.noop();
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      scrollStrategy,
      positionStrategy,
      ...('panelClass' in config
        ? { panelClass: config.panelClass }
        : undefined),
      ...('direction' in config ? { direction: config.direction } : undefined),
      ...('hasBackdrop' in config
        ? { hasBackdrop: config.hasBackdrop }
        : undefined),
      ...('backdropClass' in config
        ? { backdropClass: config.backdropClass }
        : undefined),
      ...('width' in config ? { width: config.width } : undefined),
      ...('height' in config ? { height: config.height } : undefined),
      ...('minWidth' in config ? { minWidth: config.minWidth } : undefined),
      ...('minHeight' in config ? { minHeight: config.minHeight } : undefined),
      ...('maxWidth' in config ? { maxWidth: config.maxWidth } : undefined),
      ...('maxHeight' in config ? { maxHeight: config.maxHeight } : undefined),
    });
  }

  /**
   * Creates the injector that will be used by the content inserted
   * within the popup.
   *
   * @param config A Popup configuration object.
   * @param popupRef A PopupRef handle.
   * @param popupContainer An instance of PopupContainerComponent.
   * @returns An injector that can later be used a component that is inserted in a ComponentPortal.
   */
  private createInjector<T, R>(
    config: PopupConfig,
    popupRef: PopupRef<T, R>,
    popupContainer: OverlayContainerComponent
  ): Injector {
    const userInjector = config?.viewContainerRef?.injector;
    const providers: StaticProvider[] = [
      { provide: OverlayContainerComponent, useValue: popupContainer },
      { provide: POPUP_DATA, useValue: config.data },
      { provide: PopupRef, useValue: popupRef },
    ];

    if (
      config.direction &&
      (!userInjector ||
        !userInjector.get<Directionality | null>(Directionality, null, {
          optional: true,
        }))
    ) {
      providers.push({
        provide: Directionality,
        useValue: { value: config.direction, change: of() },
      });
    }

    return Injector.create({
      parent: userInjector || this.injector,
      providers,
    });
  }
}
