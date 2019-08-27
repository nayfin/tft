import { TestBed } from '@angular/core/testing';

import { InteractService } from './interact.service';

describe('InteractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InteractService = TestBed.get(InteractService);
    expect(service).toBeTruthy();
  });
});
