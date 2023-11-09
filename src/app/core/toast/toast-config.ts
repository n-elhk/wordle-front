import { InjectionToken, TemplateRef } from '@angular/core';

export class ToastData {
  type: ToastType = 'info';
  text?: string;
  template?: TemplateRef<any>;
  templateContext?: {};
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

export const TOAST_CONFIG = new InjectionToken('TOAST_CONFIG');
export const TOAST_DATA = new InjectionToken('TOAST_DATA');
