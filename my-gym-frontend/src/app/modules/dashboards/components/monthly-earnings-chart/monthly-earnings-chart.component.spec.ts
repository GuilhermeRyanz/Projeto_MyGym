import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEarningsChartComponent } from './monthly-earnings-chart.component';

describe('MonthlyEarningsChartComponent', () => {
  let component: MonthlyEarningsChartComponent;
  let fixture: ComponentFixture<MonthlyEarningsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyEarningsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyEarningsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
