import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsDetailsComponent } from './conversations-details.component';

describe('ConversationsDetailsComponent', () => {
  let component: ConversationsDetailsComponent;
  let fixture: ComponentFixture<ConversationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
