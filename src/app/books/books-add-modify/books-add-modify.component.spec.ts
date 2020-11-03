import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksAddModifyComponent } from './books-add-modify.component';

describe('BooksAddModifyComponent', () => {
  let component: BooksAddModifyComponent;
  let fixture: ComponentFixture<BooksAddModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksAddModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksAddModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
