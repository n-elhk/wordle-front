import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { WaitingBoardComponent } from './waiting-board/waiting-board.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppStoreModule } from './core/store/store.module';
import { HttpClientModule } from '@angular/common/http';
import { LetModule, PushModule } from '@ngrx/component';
import { HelpComponent } from './help/help.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    WaitingBoardComponent,
    ModalStatisticComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule,
    HttpClientModule,
    SharedModule,

    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDialogModule,
    ClipboardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,

    ReactiveFormsModule,

    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    LetModule, PushModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
