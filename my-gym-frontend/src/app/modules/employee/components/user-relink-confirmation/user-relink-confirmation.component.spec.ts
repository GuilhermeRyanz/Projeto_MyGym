import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRelinkConfirmationComponent } from './user-relink-confirmation.component';

describe('UserRelinkConfirmationComponent', () => {
  let component: UserRelinkConfirmationComponent;
  let fixture: ComponentFixture<UserRelinkConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRelinkConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRelinkConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
