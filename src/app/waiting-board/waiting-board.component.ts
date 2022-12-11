import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { GameStatus } from '@models';
import { ShareDirective } from '@shared/directives/share.directive';
import { AwesomeTooltipDirective } from '@shared/directives/tooltip.directive';

@Component({
  selector: 'app-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingBoardComponent extends ShareDirective {

  @Input() public status!: GameStatus;
  @ViewChild(AwesomeTooltipDirective) public tooltip!: AwesomeTooltipDirective;

  clipBord(): void {
    this.tooltip.disabled = false;
    this.tooltip.show();

    setTimeout(() => {
      this.tooltip.disabled = true;
      this.tooltip.hide();
    }, 500);

  }

}
