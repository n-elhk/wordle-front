import { NgModule } from '@angular/core';
import { OverlayContainerComponent } from '@shared/components/overlay-container.component';
import { AppStoreModule } from '@store/store.module';
import { LetModule, PushModule } from '@ngrx/component';

@NgModule({
  imports: [
    AppStoreModule,
    LetModule, 
    PushModule,
  ],
  exports: [
    AppStoreModule,
    LetModule, 
    PushModule,
  ]
})
export class CoreModule { }
