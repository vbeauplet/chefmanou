import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringPickerComponent } from './string-picker.component';

describe('StringPickerComponent', () => {
  let component: StringPickerComponent;
  let fixture: ComponentFixture<StringPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
