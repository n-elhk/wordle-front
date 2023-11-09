import {
  Injectable,
  Injector,
  Inject,
  StaticProvider,
  Optional,
} from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ToastComponent } from './toast.component';
import {
  ToastData,
  ToastConfig,
  TOAST_CONFIG,
  TOAST_DATA,
} from './toast-config';
import { ToastRef } from './toast-ref';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private lastToast: ToastRef | undefined = undefined;

  constructor(
    private injector: Injector,
    private overlay: Overlay,
    @Optional() @Inject(TOAST_CONFIG) private defaultOptions: ToastConfig
  ) {}

  show(config?: ToastConfig, isMultiple = false) {
    config = this.mergeWithDefaultConfig(
      config,
      this.defaultOptions || new ToastConfig()
    );

    if (!isMultiple && this.lastToast && this.lastToast.isVisible()) {
      this.lastToast.close();
    }

    const positionStrategy = this.getPositionStrategy(config);
    const overlayRef = this.overlay.create({ positionStrategy });

    const toastRef = new ToastRef(overlayRef);
    this.lastToast = toastRef;

    const injector = this.createInjector(config, toastRef);
    const toastPortal = new ComponentPortal(ToastComponent, null, injector);

    overlayRef.attach(toastPortal);

    return toastRef;
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
  private mergeWithDefaultConfig(
    config?: ToastConfig,
    defaultOptions?: ToastConfig
  ): ToastConfig {
    return { ...defaultOptions, ...config } as ToastConfig;
  }

  getPositionStrategy(config: ToastConfig) {
    return this.overlay
      .position()
      .global()
      .top(this.getPosition(config))
      .right(config?.position?.right + 'px');
  }

  getPosition(config: ToastConfig) {
    const lastToast = this.lastToast;
    const lastToastIsVisible = lastToast && lastToast.isVisible();
    const position = lastToastIsVisible
      ? lastToast.getPosition().bottom
      : config?.position?.top;

    return position + 'px';
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
  private createInjector(config: ToastConfig, toastRef: ToastRef): Injector {
    const providers: StaticProvider[] = [
      { provide: TOAST_CONFIG, useValue: config },
      { provide: TOAST_DATA, useValue: config.data },
      { provide: ToastRef, useValue: toastRef },
    ];

    return Injector.create({
      parent: this.injector,
      providers,
    });
  }

  getInjector(data: ToastData, toastRef: ToastRef, parentInjector: Injector) {
    const tokens = new WeakMap();

    tokens.set(ToastData, data);
    tokens.set(ToastRef, toastRef);

    return Injector.create({
      parent: parentInjector,
      providers: [],
    });
  }
}
