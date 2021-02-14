import { HighlightDirective } from './highlight.directive';
import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    var el: ElementRef;
    var renderer: Renderer2;
    const directive = new HighlightDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
});
