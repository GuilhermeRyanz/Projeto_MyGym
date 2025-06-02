import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthBalanceComponent } from './month-balance.component';

describe('MonthBalanceComponent', () => {
  let component: MonthBalanceComponent;
  let fixture: ComponentFixture<MonthBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
