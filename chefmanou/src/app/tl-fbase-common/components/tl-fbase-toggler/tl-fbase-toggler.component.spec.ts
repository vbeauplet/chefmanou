import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlFbaseTogglerComponent } from './tl-fbase-toggler.component';

describe('TlFbaseTogglerComponent', () => {
  let component: TlFbaseTogglerComponent;
  let fixture: ComponentFixture<TlFbaseTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlFbaseTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlFbaseTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
