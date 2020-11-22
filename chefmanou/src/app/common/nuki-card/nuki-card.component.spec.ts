import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NukiCardComponent } from './nuki-card.component';

describe('NukiCardComponent', () => {
  let component: NukiCardComponent;
  let fixture: ComponentFixture<NukiCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NukiCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NukiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
