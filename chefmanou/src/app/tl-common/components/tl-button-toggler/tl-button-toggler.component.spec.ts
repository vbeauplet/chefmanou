import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonTogglerComponent } from './button-toggler.component';

describe('ButtonTogglerComponent', () => {
  let component: ButtonTogglerComponent;
  let fixture: ComponentFixture<ButtonTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
