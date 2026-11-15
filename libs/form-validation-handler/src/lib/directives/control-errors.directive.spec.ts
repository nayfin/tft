import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorDictionary } from '../form-errors';
import { ControlErrorsFormDirective } from './control-errors-form.directive';
import { ControlErrorsDirective } from './control-errors.directive';

@Component({
  imports: [
    ReactiveFormsModule,
    ControlErrorsFormDirective,
    ControlErrorsDirective,
  ],
  template: `
    <form [errorDictionary]="dictionary()">
      <input [formControl]="control" />
    </form>
  `,
})
class TestHostComponent {
  readonly dictionary = signal<ErrorDictionary | undefined>(undefined);
  readonly control = new FormControl('', Validators.required);
}

describe('ControlErrorsDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: ControlErrorsDirective;

  function errorText(): string | undefined {
    return fixture.nativeElement
      .querySelector('p.tft-control-error')
      ?.textContent?.trim();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
    directive = fixture.debugElement
      .query((el) => el.name === 'input')
      .injector.get(ControlErrorsDirective);
  });

  async function showError() {
    host.control.markAsTouched();
    host.control.updateValueAndValidity();
    await fixture.whenStable();
  }

  it('should use the default message when the form has no dictionary', async () => {
    await showError();

    expect(errorText()).toBe('This field is required');
  });

  it('should use the form dictionary', async () => {
    host.dictionary.set({ required: () => 'Fill me in' });
    await fixture.whenStable();

    await showError();

    expect(errorText()).toBe('Fill me in');
  });

  it('should use a dictionary that changes after the directive was created', async () => {
    host.dictionary.set({ required: () => 'First message' });
    await fixture.whenStable();
    await showError();
    expect(errorText()).toBe('First message');

    host.dictionary.set({ required: () => 'Second message' });
    await fixture.whenStable();
    host.control.updateValueAndValidity();
    await fixture.whenStable();

    expect(errorText()).toBe('Second message');
  });

  it('should keep the default messages the dictionary does not override', async () => {
    host.dictionary.set({ other: () => 'Other' });
    await fixture.whenStable();

    await showError();

    expect(errorText()).toBe('This field is required');
  });

  it('should let consumers replace the errors', async () => {
    directive.errors = { required: () => 'Assigned' };

    await showError();

    expect(errorText()).toBe('Assigned');
  });
});
