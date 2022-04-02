import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { WaitingBoardComponent } from './waiting-board/waiting-board.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LetterPipe } from './core/pipes/letter.pipe';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppStoreModule } from './core/store/store.module';
import { HttpClientModule } from '@angular/common/http';
import { KeyboardDirective } from './core/directives/keyboard.directive';
import { ReactiveComponentModule } from '@ngrx/component';
import { StorageService } from './core/services/storage/storage.service';
import { ShareDirective } from './core/directives/share.directive';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    WaitingBoardComponent,
    ModalStatisticComponent,

    LetterPipe,
    KeyboardDirective,
    ShareDirective,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule,
    HttpClientModule,

    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    
    ReactiveFormsModule,

    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    ReactiveComponentModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [{
    provide: APP_INITIALIZER,
    deps: [StorageService],
    useFactory: (storageService: StorageService) => () => storageService.create(),
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
