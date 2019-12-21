import { async, TestBed } from '@angular/core/testing';
import { UiImportsModule } from './ui-imports.module';

describe('UiImportsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiImportsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiImportsModule).toBeDefined();
  });
});
