import { async, TestBed } from '@angular/core/testing';
import { InteractModule } from './interact.module';

describe('InteractModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InteractModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(InteractModule).toBeDefined();
  });
});
