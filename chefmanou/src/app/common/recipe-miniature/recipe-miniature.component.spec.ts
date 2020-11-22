import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeMiniatureComponent } from './recipe-miniature.component';

describe('RecipeMiniatureComponent', () => {
  let component: RecipeMiniatureComponent;
  let fixture: ComponentFixture<RecipeMiniatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeMiniatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeMiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
