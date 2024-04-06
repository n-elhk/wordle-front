import { ClipboardModule } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AwesomeTooltipDirective, ShareDirective } from '@common/directives';

@Component({
  selector: 'wd-waiting-board',
  templateUrl: './waiting-board.component.html',
  styleUrls: ['./waiting-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClipboardModule, AwesomeTooltipDirective],
  standalone: true,
})
export class WaitingBoardComponent extends ShareDirective {}
