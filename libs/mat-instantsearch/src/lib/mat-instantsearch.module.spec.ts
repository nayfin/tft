import { async, TestBed } from '@angular/core/testing';
import { MatInstantsearchModule } from './mat-instantsearch.module';

describe('MatInstantsearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatInstantsearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MatInstantsearchModule).toBeDefined();
  });
});
