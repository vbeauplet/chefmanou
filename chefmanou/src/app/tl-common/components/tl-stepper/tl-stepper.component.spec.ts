import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlStepperComponent } from './tl-stepper.component';

describe('TlStepperComponent', () => {
  let component: TlStepperComponent;
  let fixture: ComponentFixture<TlStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
