import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResizableDirective } from './resizable.directive';

@Component({
  imports: [ResizableDirective],
  template: `<div tftResizable></div>`,
})
class TestHostComponent {}

describe('ResizableDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: ResizableDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(ResizableDirective))
      .injector.get(ResizableDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });
});
