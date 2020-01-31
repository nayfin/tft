import { async, TestBed } from '@angular/core/testing';
import { AlgoliaInstantsearchModule } from './algolia-instantsearch.module';

describe('AlgoliaInstantsearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AlgoliaInstantsearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AlgoliaInstantsearchModule).toBeDefined();
  });
});
