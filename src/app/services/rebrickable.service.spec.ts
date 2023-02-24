import { TestBed } from '@angular/core/testing';

import { RebrickableService } from './rebrickable.service';

describe('RebrickableService', () => {
  let service: RebrickableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RebrickableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
