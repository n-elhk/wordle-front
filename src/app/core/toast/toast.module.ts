import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastConfig, TOAST_CONFIG } from './toast-config';


@NgModule({
  imports: [
    ToastComponent,
  ],
  exports: [
    ToastComponent,
  ]
})
export class ToastModule {
  public static forRoot(config = new ToastConfig()): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: { ...new ToastConfig(), ...config },
        },
      ],
    };
  }
}
