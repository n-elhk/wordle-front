import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'awesome-tooltip',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `<div @tooltip>{{ text }}</div>`,
    styles: [`
    :host{
        color: var(--text-color);
    }
    `],
    animations: [
        trigger('tooltip', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate(300, style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class AwesomeTooltipComponent {
    @Input() public text = '';
}
