import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPlansOverviewComponentComponent } from './member-plans-overview-component.component';

describe('MemberPlansOverviewComponentComponent', () => {
  let component: MemberPlansOverviewComponentComponent;
  let fixture: ComponentFixture<MemberPlansOverviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPlansOverviewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberPlansOverviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
