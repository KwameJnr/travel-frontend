import { TestBed } from '@angular/core/testing';

import { BuheadService } from './buhead.service';

describe('BuheadService', () => {
  let service: BuheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
