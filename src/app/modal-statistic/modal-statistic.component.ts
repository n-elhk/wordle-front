import { ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordleStat } from '@models/statistic';
import { Store } from '@ngrx/store';
import { ShareDirective } from '../shared/directives/share.directive';
import { GameService } from '../core/services/game/game.service';
import { AppState } from '../core/store/core.reducer';

@Component({
  selector: 'app-modal-statistic',
  templateUrl: './modal-statistic.component.html',
  styleUrls: ['./modal-statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalStatisticComponent extends ShareDirective implements OnDestroy {

  public bestStreak = 0;
  public currentStreak = 0;
  public percentWin = 0;
  public bestAttempts: number[] = [];

  constructor(
    inject: Injector,
    store: Store<AppState>,
    gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: WordleStat,
  ) {
    super(inject, store);
    this.bestStreak = gameService.bestStreak(this.data.games)[0];
    this.currentStreak = gameService.currentStreak(this.data.games);
    this.percentWin = Math.round(gameService.percentWin(this.data.games));
    this.bestAttempts = gameService.bestAttempts(this.data.games);
  }
}
