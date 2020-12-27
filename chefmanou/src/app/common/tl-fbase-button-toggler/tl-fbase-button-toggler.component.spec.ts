import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlFbaseButtonTogglerComponent } from './tl-fbase-button-toggler.component';

describe('TlFbaseButtonTogglerComponent', () => {
  let component: TlFbaseButtonTogglerComponent;
  let fixture: ComponentFixture<TlFbaseButtonTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlFbaseButtonTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlFbaseButtonTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
