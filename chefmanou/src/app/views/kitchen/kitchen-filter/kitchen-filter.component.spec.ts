import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenFilterComponent } from './kitchen-filter.component';

describe('KitchenFilterComponent', () => {
  let component: KitchenFilterComponent;
  let fixture: ComponentFixture<KitchenFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
