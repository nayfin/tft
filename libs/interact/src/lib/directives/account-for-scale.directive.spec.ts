import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AccountForScaleDirective } from './account-for-scale.directive';

@Component({
  imports: [AccountForScaleDirective],
  template: `<div tftAccountForScale></div>`,
})
class TestHostComponent {}

describe('AccountForScaleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: AccountForScaleDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(AccountForScaleDirective))
      .injector.get(AccountForScaleDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });

  it('should default the scale to 1', () => {
    expect(directive.scale()).toBe(1);
  });
});
