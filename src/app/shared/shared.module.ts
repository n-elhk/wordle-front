import { NgModule } from '@angular/core';
import { KeyboardDirective } from './directives/keyboard.directive';
import { ShareDirective } from './directives/share.directive';
import { LetterPipe } from './pipes/letter.pipe';
import { AwesomeTooltipDirective } from './directives/tooltip.directive';
import { AwesomeTooltipComponent } from './components/tooltip.component';
import { DestroyedDirective } from './directives/destroyed.directive';
import { OverlayContainerComponent } from './components/overlay-container.component';

const components = [
  AwesomeTooltipComponent,
  OverlayContainerComponent,
];

const directives = [
  DestroyedDirective,
  KeyboardDirective,
  AwesomeTooltipDirective,
  ShareDirective,
];

const pipes = [
  LetterPipe,
];

@NgModule({
  imports: [
    ...directives,
    ...components,
    ...pipes,
  ],
  exports: [
    ...directives,
    ...components,
    ...pipes,
  ]
})
export class SharedModule { }
