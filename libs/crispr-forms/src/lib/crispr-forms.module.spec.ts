import { TestBed } from '@angular/core/testing';
import { CrisprFormsModule } from './crispr-forms.module';

describe('CrisprFormsModule', () => {
  it('should be importable into a TestBed', async () => {
    await TestBed.configureTestingModule({
      imports: [CrisprFormsModule],
    }).compileComponents();

    expect(TestBed.inject(CrisprFormsModule)).toBeInstanceOf(CrisprFormsModule);
  });
});
