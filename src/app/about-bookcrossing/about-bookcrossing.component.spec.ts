import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBookcrossingComponent } from './about-bookcrossing.component';

describe('AboutBookcrossingComponent', () => {
  let component: AboutBookcrossingComponent;
  let fixture: ComponentFixture<AboutBookcrossingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutBookcrossingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBookcrossingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
