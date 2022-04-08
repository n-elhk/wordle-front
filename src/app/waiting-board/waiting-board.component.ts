import { Component, Injector, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStatus } from '@models';
import { Store } from '@ngrx/store';
import { ShareDirective } from '../shared/directives/share.directive';
import { AppState } from '../core/store/core.reducer';


@Component({
  selector: 'app-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss']
})
export class WaitingBoardComponent extends ShareDirective implements OnDestroy {

  @Input() public status!: GameStatus;
  @ViewChild(MatTooltip) public matTooltip!: MatTooltip;

  constructor(
    inject: Injector,
    store: Store<AppState>,
  ) {
    super(inject, store);
  }

  clipBord(): void {
    this.matTooltip.disabled = false;
    this.matTooltip.show();

    setTimeout(() =>  this.matTooltip.disabled = true, 500);
    navigator.clipboard.writeText(this.url);
  }

}
