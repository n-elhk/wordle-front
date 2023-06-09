import { NgModule } from '@angular/core';
import { AppStoreModule } from '@store/store.module';
import { LetDirective, PushPipe } from '@ngrx/component';

@NgModule({
  imports: [
    AppStoreModule,
    LetDirective, 
    PushPipe,
  ],
  exports: [
    AppStoreModule,
    LetDirective, 
    PushPipe,
  ]
})
export class CoreModule { }
