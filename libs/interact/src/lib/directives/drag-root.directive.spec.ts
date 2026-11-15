import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragRootDirective } from './drag-root.directive';

@Component({
  imports: [DragRootDirective],
  template: `<div tftDragRoot></div>`,
})
class TestHostComponent {}

describe('DragRootDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: DragRootDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(DragRootDirective))
      .injector.get(DragRootDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });

  it('should swallow the next click on the element once a click is suppressed', () => {
    const element: HTMLElement = fixture.debugElement.query(
      By.directive(DragRootDirective)
    ).nativeElement;
    const listener = jest.fn();
    element.addEventListener('click', listener);

    directive.suppressNextClick();
    element.click();
    expect(listener).not.toHaveBeenCalled();

    element.click();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
