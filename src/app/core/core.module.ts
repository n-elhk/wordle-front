import { NgModule } from '@angular/core';
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
