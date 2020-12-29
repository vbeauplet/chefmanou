import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlTimelineCardComponent } from './tl-timeline-card.component';

describe('TlTimelineCardComponent', () => {
  let component: TlTimelineCardComponent;
  let fixture: ComponentFixture<TlTimelineCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlTimelineCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlTimelineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
