import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  declarations: [
    ...directives,
    ...pipes,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ...directives,
    ...pipes,
  ]
})
export class SharedModule { }
