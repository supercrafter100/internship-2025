import { TestBed } from '@angular/core/testing';

import { TtnService } from './ttn.service';

describe('TtnService', () => {
  let service: TtnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TtnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
