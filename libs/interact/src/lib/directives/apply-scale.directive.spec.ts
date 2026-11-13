import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ApplyScaleDirective } from './apply-scale.directive';

@Component({
  imports: [ApplyScaleDirective],
  template: `<div tftApplyScale [scale]="2"></div>`,
})
class TestHostComponent {}

describe('ApplyScaleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: ApplyScaleDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(ApplyScaleDirective))
      .injector.get(ApplyScaleDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply the scale as the font size of the element', () => {
    const element: HTMLElement = fixture.debugElement.query(
      By.directive(ApplyScaleDirective)
    ).nativeElement;
    expect(element.style.fontSize).toBe('2px');
  });
});
