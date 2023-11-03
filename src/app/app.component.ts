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

import { OverlayService } from '@services/popup/popup.service';
import { CommonModule } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { GameComponent } from './pages/game/game.component';
import { WaitingBoardComponent } from './pages/waiting-board/waiting-board.component';
import { HelpComponent, ModalStatisticComponent } from '@components/modals';
import { SvgIcon } from '@components/icon';

@Component({
  selector: 'wd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    SvgIcon,
    PushPipe,
    GameComponent,
    WaitingBoardComponent,
  ],
})
export class AppComponent {
  /** Injection of {@link FormBuilder}. */
  private readonly store = inject(Store);

  /** Injection of {@link OverlayService}. */
  private readonly overlayService = inject(OverlayService);

  /** Injection of {@link ViewContainerRef}. */
  private readonly vcr = inject(ViewContainerRef);

  /** Injection of {@link StorageService}. */
  private readonly storageService = inject(StorageService);

  public readonly title = 'Le verbe';

  public readonly status = this.store.selectSignal(selectGameStatus);

  public openStatDialog(): void {
    const wordleState = this.storageService.getStorage(StorageKey.Stat);
    this.overlayService.open(ModalStatisticComponent, {
      viewContainerRef: this.vcr,
      hasBackdrop: true,
      width: '500px',
      panelClass: 'popup',
      data: wordleState,
    });
  }

  public openHelpDialog(): void {
    this.overlayService.open(HelpComponent, {
      width: '500px',
      panelClass: 'popup',
      viewContainerRef: this.vcr,
      hasBackdrop: true,
    });
  }
}
