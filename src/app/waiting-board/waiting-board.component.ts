import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { GameStatus } from '@models';
import { ShareDirective } from '@shared/directives/share.directive';

@Component({
  selector: 'app-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingBoardComponent extends ShareDirective {

  @Input() public status!: GameStatus;
  @ViewChild(MatTooltip) public matTooltip!: MatTooltip;

  clipBord(): void {
    this.matTooltip.disabled = false;
    this.matTooltip.show();

    setTimeout(() => this.matTooltip.disabled = true, 500);
    navigator.clipboard.writeText(this.url);
  }

}
