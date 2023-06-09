import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SvgIcon } from '@components/icon';
import { PopupRef } from '@services/popup/popup-ref';

@Component({
  selector: 'wd-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SvgIcon],
})
export class HelpComponent {
  /** Injection of {@link PopupRef}. */
  public popupRef = inject(PopupRef);
}
