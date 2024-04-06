import { InjectionToken, TemplateRef } from '@angular/core';

export class ToastData {
  type: ToastType = 'info';
  text?: string;
  template?: TemplateRef<unknown>;
  templateContext?: Record<string, unknown>;
}

export type ToastType = 'warning' | 'info' | 'success';

export class ToastConfig {
  public position? = {
    top: 20,
    right: 20,
  };
  public animation? = {
    fadeOut: 2500,
    fadeIn: 300,
  };
  public data: ToastData | undefined = undefined;
}

export const TOAST_CONFIG = new InjectionToken<ToastConfig>('TOAST_CONFIG');
export const TOAST_DATA = new InjectionToken<ToastData>('TOAST_DATA');
