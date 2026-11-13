import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropzoneDirective } from './dropzone.directive';

@Component({
  imports: [DropzoneDirective],
  template: `<div tftDropzone></div>`,
})
class TestHostComponent {}

describe('DropzoneDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: DropzoneDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    directive = fixture.debugElement
      .query(By.directive(DropzoneDirective))
      .injector.get(DropzoneDirective);
  });

  it('should create an instance on a host element', () => {
    expect(directive).toBeTruthy();
  });

  it('should register the element as an interact dropzone', () => {
    expect(directive.dropzone).toBeTruthy();
  });
});
