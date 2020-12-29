import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveInputComponent } from './interactive-input.component';

describe('InteractiveInputComponent', () => {
  let component: InteractiveInputComponent;
  let fixture: ComponentFixture<InteractiveInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
