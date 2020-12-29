import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlinedActiveImageComponent } from './outlined-active-image.component';

describe('OutlinedActiveImageComponent', () => {
  let component: OutlinedActiveImageComponent;
  let fixture: ComponentFixture<OutlinedActiveImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutlinedActiveImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlinedActiveImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
