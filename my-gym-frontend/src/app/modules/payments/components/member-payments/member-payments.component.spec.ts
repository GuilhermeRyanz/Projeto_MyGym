import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPaymentsComponent } from './member-payments.component';

describe('MemberPaymentsComponent', () => {
  let component: MemberPaymentsComponent;
  let fixture: ComponentFixture<MemberPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
