import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRegistrationComponent } from './payment-registration.component';

describe('PaymentRegistrationComponent', () => {
  let component: PaymentRegistrationComponent;
  let fixture: ComponentFixture<PaymentRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
