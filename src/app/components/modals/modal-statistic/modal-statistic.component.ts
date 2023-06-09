import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from '@angular/core';
import { AwesomeTooltipDirective, ShareDirective } from '@common/directives';
import { SvgIcon } from '@components/icon';
import { WordleStat } from '@models/statistic';
import { GameService } from '@services/game/game.service';
import { PopupRef } from '@services/popup/popup-ref';
import { OverlayService, POPUP_DATA } from '@services/popup/popup.service';

@Component({
  selector: 'wd-modal-statistic',
  templateUrl: './modal-statistic.component.html',
  styleUrls: ['./modal-statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SvgIcon,
    ClipboardModule,
    ShareDirective,
    AwesomeTooltipDirective,
  ],
  standalone: true,
})
export class ModalStatisticComponent extends ShareDirective {
  /** Injection of {@link GameService}. */
  private gameService = inject(GameService);

  /** Injection of {@link POPUP_DATA}. */
  public data = inject<WordleStat>(POPUP_DATA);

  /** Injection of {@link PopupRef}. */
  public popupRef = inject(PopupRef);

  public bestStreak = this.gameService.bestStreak(this.data.games)[0];

  public currentStreak = this.gameService.currentStreak(this.data.games);

  public percentWin = Math.round(this.gameService.percentWin(this.data.games));

  public bestAttempts = this.gameService.bestAttempts(this.data.games);
}
