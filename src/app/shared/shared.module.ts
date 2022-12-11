import { NgModule } from '@angular/core';
import { KeyboardDirective } from './directives/keyboard.directive';
import { ShareDirective } from './directives/share.directive';
import { LetterPipe } from './pipes/letter.pipe';


const directives = [
  KeyboardDirective,
  ShareDirective,
];

const pipes = [
  LetterPipe,
];

@NgModule({
  imports: [
    ...directives,
    ...pipes,
  ],
  exports:[
    ...directives,
    ...pipes,
  ]
})
export class SharedModule { }
