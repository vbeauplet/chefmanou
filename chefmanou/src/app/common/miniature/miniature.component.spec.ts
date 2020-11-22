import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniatureComponent } from './miniature.component';

describe('MiniatureComponent', () => {
  let component: MiniatureComponent;
  let fixture: ComponentFixture<MiniatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
