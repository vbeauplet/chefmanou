import { TestBed } from '@angular/core/testing';

import { RecipeFilterService } from './recipe-filter.service';

describe('RecipeFilterService', () => {
  let service: RecipeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
