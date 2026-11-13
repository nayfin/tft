import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DraggableDirective } from './draggable.directive';

@Component({
  imports: [DraggableDirective],
  template: `<div tftDraggable></div>`,
})
class TestHostComponent {}

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: DraggableDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(DraggableDirective))
      .injector.get(DraggableDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });
});
