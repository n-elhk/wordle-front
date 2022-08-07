import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordleStat } from '@models/statistic';
import { ShareDirective } from '../shared/directives/share.directive';
import { GameService } from '../core/services/game/game.service';


@Component({
  selector: 'app-modal-statistic',
  templateUrl: './modal-statistic.component.html',
  styleUrls: ['./modal-statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalStatisticComponent extends ShareDirective implements OnDestroy {

  protected bestStreak = 0;
  protected currentStreak = 0;
  protected percentWin = 0;
  protected bestAttempts: number[] = [];

  constructor(
    gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: WordleStat,
  ) {
    super();
    this.bestStreak = gameService.bestStreak(this.data.games)[0];
    this.currentStreak = gameService.currentStreak(this.data.games);
    this.percentWin = Math.round(gameService.percentWin(this.data.games));
    this.bestAttempts = gameService.bestAttempts(this.data.games);
  }
}
