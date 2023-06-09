import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { IconRegistery } from './icon-registery';
import { take, tap } from 'rxjs';

@Component({
  template: '<ng-content></ng-content>',
  standalone: true,
  selector: 'svg-icon',
  exportAs: 'svgIcon',
  inputs: ['color'],
  styleUrls: ['./icon.scss'],
  host: {
    role: 'img',
    class: 'svg-icon notranslate',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIcon {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private iconRegistery = inject(IconRegistery);

  @Input() public set svgName(svgName: string) {
    this._clearSvgElement();
    this.iconRegistery
      .getNamedSvgIcon(svgName)
      .pipe(
        take(1),
        tap(svg => this._setSvgElement(svg))
      )
      .subscribe();
  }

  private _clearSvgElement(): void {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;

    // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
    // we can't use innerHTML, because IE will throw if the element has a data binding.
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];

      // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes in order to get rid
      // of any loose text nodes, as well as any SVG elements in order to remove any old icons.
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
        child.remove();
      }
    }
  }

  private _setSvgElement(svg: SVGElement): void {
    this._clearSvgElement();

    this._elementRef.nativeElement.appendChild(svg);
  }
}
