import { TestBed } from '@angular/core/testing';
import { InteractModule } from './interact.module';

describe('InteractModule', () => {
  it('should be importable into a TestBed', async () => {
    await TestBed.configureTestingModule({
      imports: [InteractModule],
    }).compileComponents();

    expect(TestBed.inject(InteractModule)).toBeInstanceOf(InteractModule);
  });
});
