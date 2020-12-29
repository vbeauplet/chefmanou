import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlAlertComponent } from './tl-alert.component';

describe('TlAlertComponent', () => {
  let component: TlAlertComponent;
  let fixture: ComponentFixture<TlAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TlAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
