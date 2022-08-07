import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStatus } from '@models';
import { ShareDirective } from '../shared/directives/share.directive';



@Component({
  selector: 'app-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss']
})
export class WaitingBoardComponent extends ShareDirective implements OnDestroy {

  @Input() public status!: GameStatus;
  @ViewChild(MatTooltip) public matTooltip!: MatTooltip;

  constructor() {
    super();
  }

  clipBord(): void {
    this.matTooltip.disabled = false;
    this.matTooltip.show();

    setTimeout(() =>  this.matTooltip.disabled = true, 500);
    navigator.clipboard.writeText(this.url);
  }

}
