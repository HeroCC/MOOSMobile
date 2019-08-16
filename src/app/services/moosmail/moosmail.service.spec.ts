import { TestBed } from '@angular/core/testing';

import { MoosmailService } from './moosmail.service';

describe('MoosmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoosmailService = TestBed.get(MoosmailService);
    expect(service).toBeTruthy();
  });
});
