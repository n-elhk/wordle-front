import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WordleStat } from '@models/statistic';
import { GameService } from '@services/game/game.service';
import { POPUP_DATA } from '@services/popup/popup.service';
import { ShareDirective } from '@shared/directives/share.directive';


@Component({
  selector: 'app-modal-statistic',
  templateUrl: './modal-statistic.component.html',
  styleUrls: ['./modal-statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalStatisticComponent extends ShareDirective {
  private gameService = inject(GameService);

  protected data = inject<WordleStat>(POPUP_DATA);
  protected bestStreak = this.gameService.bestStreak(this.data.games)[0];
  protected currentStreak = this.gameService.currentStreak(this.data.games);
  protected percentWin = Math.round(this.gameService.percentWin(this.data.games));
  protected bestAttempts = this.gameService.bestAttempts(this.data.games);
}
