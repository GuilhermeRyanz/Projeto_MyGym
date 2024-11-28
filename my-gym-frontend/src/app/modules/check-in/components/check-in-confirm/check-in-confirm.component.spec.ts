import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInConfirmComponent } from './check-in-confirm.component';

describe('CheckInConfirmComponent', () => {
  let component: CheckInConfirmComponent;
  let fixture: ComponentFixture<CheckInConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
