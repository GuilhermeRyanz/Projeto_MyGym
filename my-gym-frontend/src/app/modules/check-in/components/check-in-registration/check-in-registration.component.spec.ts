import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInRegistrationComponent } from './check-in-registration.component';

describe('CheckInRegistrationComponent', () => {
  let component: CheckInRegistrationComponent;
  let fixture: ComponentFixture<CheckInRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
