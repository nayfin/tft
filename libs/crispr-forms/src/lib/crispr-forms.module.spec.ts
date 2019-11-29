import { async, TestBed } from '@angular/core/testing';
import { CrisprFormsModule } from './crispr-forms.module';

describe('CrisprFormsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CrisprFormsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CrisprFormsModule).toBeDefined();
  });
});
