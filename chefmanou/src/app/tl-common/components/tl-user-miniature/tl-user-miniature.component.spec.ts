import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMiniatureComponent } from './user-miniature.component';

describe('UserMiniatureComponent', () => {
  let component: UserMiniatureComponent;
  let fixture: ComponentFixture<UserMiniatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMiniatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMiniatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
