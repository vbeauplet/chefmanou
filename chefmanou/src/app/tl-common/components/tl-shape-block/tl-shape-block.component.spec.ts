import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeBlockComponent } from './shape-block.component';

describe('ShapeBlockComponent', () => {
  let component: ShapeBlockComponent;
  let fixture: ComponentFixture<ShapeBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
