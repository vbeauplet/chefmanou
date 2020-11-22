import { TestBed } from '@angular/core/testing';

import { RecipeDashboardService } from './recipe-dashboard.service';

describe('RecipeDashboardService', () => {
  let service: RecipeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
