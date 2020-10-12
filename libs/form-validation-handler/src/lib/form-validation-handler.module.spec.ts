import { async, TestBed } from '@angular/core/testing';
import { FormValidationHandlerModule } from './form-validation-handler.module';

describe('FormValidationHandlerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormValidationHandlerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FormValidationHandlerModule).toBeDefined();
  });
});
