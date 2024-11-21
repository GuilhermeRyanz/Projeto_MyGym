import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPlanComponent } from './member-plan.component';

describe('MemberPlanComponent', () => {
  let component: MemberPlanComponent;
  let fixture: ComponentFixture<MemberPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
