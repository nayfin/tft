import { TestBed } from '@angular/core/testing';
import { FormValidationHandlerModule } from './form-validation-handler.module';

describe('FormValidationHandlerModule', () => {
  it('should be importable into a TestBed', async () => {
    await TestBed.configureTestingModule({
      imports: [FormValidationHandlerModule],
    }).compileComponents();

    expect(TestBed.inject(FormValidationHandlerModule)).toBeInstanceOf(
      FormValidationHandlerModule
    );
  });
});
