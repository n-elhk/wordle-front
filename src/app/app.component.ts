import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { StorageKey } from '@models/storage';
import { Store } from '@ngrx/store';
import { StorageService } from './core/services/storage/storage.service';
import { selectGameStatus } from './core/store/wordle';
import { HelpComponent } from './help/help.component';
import { ModalStatisticComponent } from './modal-statistic/modal-statistic.component';
import { OverlayService } from '@services/popup/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  /** Injection of {@link FormBuilder}. */
  private store = inject(Store);

  /** Injection of {@link OverlayService}. */
  private overlayService = inject(OverlayService);

  /** Injection of {@link ViewContainerRef}. */
  private vcr = inject(ViewContainerRef);

  /** Injection of {@link StorageService}. */
  private storageService = inject(StorageService);

  public title = 'wordle';

  protected status$ = this.store.select(selectGameStatus);

  public openStatDialog(): void {
    const wordleState = this.storageService.getStorage(StorageKey.Stat);
    this.overlayService.open(ModalStatisticComponent, {
      viewContainerRef: this.vcr,
      hasBackdrop: true,
      width: '500px',
      data: wordleState,
    });
  }

  public openHelpDialog(): void {
    this.overlayService.open(HelpComponent, {
      width: '500px',
      viewContainerRef: this.vcr,
      hasBackdrop: true,
    });
  }
}
