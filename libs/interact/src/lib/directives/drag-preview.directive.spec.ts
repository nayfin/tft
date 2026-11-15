import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DragPreviewDirective } from './drag-preview.directive';

@Component({
  imports: [DragPreviewDirective],
  template: `<ng-template
    tftDragPreview
    [dragData]="'preview data'"
  ></ng-template>`,
})
class TestHostComponent {
  readonly preview = viewChild.required(DragPreviewDirective);
}

describe('DragPreviewDirective', () => {
  let directive: DragPreviewDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.componentInstance.preview();
  });

  it('should create an instance on an ng-template', () => {
    expect(directive).toBeTruthy();
  });

  it('should inject the template it is attached to', () => {
    expect(directive.templateRef).toBeTruthy();
  });

  it('should expose the drag data', () => {
    expect(directive.dragData()).toBe('preview data');
  });
});
