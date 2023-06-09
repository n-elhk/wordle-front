import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { AwesomeTooltipDirective, ShareDirective } from '@common/directives';
import { GameStatus } from '@models';

@Component({
  selector: 'wd-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AwesomeTooltipDirective,
    ClipboardModule,
    ShareDirective,
  ],
  standalone: true,
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
