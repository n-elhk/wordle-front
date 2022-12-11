import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { WaitingBoardComponent } from './waiting-board/waiting-board.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { HelpComponent } from './help/help.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from './core/toast/toast.module';

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
    BrowserAnimationsModule,

    CoreModule,
    SharedModule,

    MatIconModule,
    MatSnackBarModule,
    ToastModule.forRoot(),

    ClipboardModule,

    HttpClientModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
