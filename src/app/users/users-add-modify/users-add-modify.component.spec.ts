import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAddModifyComponent } from './users-add-modify.component';

describe('UsersAddModifyComponent', () => {
  let component: UsersAddModifyComponent;
  let fixture: ComponentFixture<UsersAddModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAddModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAddModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
