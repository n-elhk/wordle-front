
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { StorageService } from './core/services/storage/storage.service';
import { AppState } from './core/store/core.reducer';
import { selectGameStatus } from './core/store/wordle';
import { HelpComponent } from './help/help.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'wordle';
  public status$ = this.store.select(selectGameStatus());

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private storageService: StorageService,
  ) { }


  openStatDialog(): void {
    const wordleState = this.storageService.getStorage(StorageKey.Stat);
    this.dialog.open(ModalStatisticComponent, {
      width: '500px',
      data: wordleState
    });
  }

  openHelpDialog(): void {
    this.dialog.open(HelpComponent, { width: '500px' });
  }
}

