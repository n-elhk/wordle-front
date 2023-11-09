import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AwesomeTooltipDirective, ShareDirective } from '@common/directives';
import { SvgIcon } from '@components/icon';
import { WordleStat } from '@models/statistic';
import { GameService } from '@services/game/game.service';
import { PopupRef } from '@services/popup/popup-ref';
import { POPUP_DATA } from '@services/popup/popup.service';

@Component({
  selector: 'wd-modal-statistic',
  templateUrl: './modal-statistic.component.html',
  styleUrls: ['./modal-statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SvgIcon,
    ClipboardModule,
    ShareDirective,
    AwesomeTooltipDirective,
  ],
  standalone: true,
})
export class ModalStatisticComponent extends ShareDirective {
  /** Injection of {@link GameService}. */
  private readonly gameService = inject(GameService);

  /** Injection of {@link POPUP_DATA}. */
  public readonly data = inject<WordleStat>(POPUP_DATA);

  /** Injection of {@link PopupRef}. */
  public readonly popupRef = inject(PopupRef);

  public readonly bestStreak = this.gameService.bestStreak(this.data.games)[0];

  public readonly currentStreak = this.gameService.currentStreak(
    this.data.games
  );

  public percentWin = Math.round(this.gameService.percentWin(this.data.games));

  public readonly bestAttempts = this.gameService.bestAttempts(this.data.games);
}
