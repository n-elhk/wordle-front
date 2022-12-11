
import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { StorageService } from './core/services/storage/storage.service';
import { AppState } from './core/store/core.reducer';
import { selectGameStatus } from './core/store/wordle';
import { HelpComponent } from './help/help.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';
import { OverlayService } from '@services/overlay/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'wordle';
  protected status$ = this.store.select(selectGameStatus());

  constructor(
    private store: Store<AppState>,
    private overlayService: OverlayService,
    private vcr: ViewContainerRef,
    private storageService: StorageService,
  ) { }


  openStatDialog(): void {
    const wordleState = this.storageService.getStorage(StorageKey.Stat);
    this.overlayService.open(ModalStatisticComponent, {
      viewContainerRef: this.vcr,
      hasBackdrop: true,
      width: '500px',
      data: wordleState
    });
  }

  openHelpDialog(): void {
    this.overlayService.open(HelpComponent, { width: '500px', viewContainerRef: this.vcr, hasBackdrop: true });
  }
}

