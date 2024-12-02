import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersFlowByTimeComponentComponent } from './members-flow-by-time-component.component';

describe('MembersFlowByTimeComponentComponent', () => {
  let component: MembersFlowByTimeComponentComponent;
  let fixture: ComponentFixture<MembersFlowByTimeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersFlowByTimeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersFlowByTimeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
