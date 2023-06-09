import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'wd-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HelpComponent {}
