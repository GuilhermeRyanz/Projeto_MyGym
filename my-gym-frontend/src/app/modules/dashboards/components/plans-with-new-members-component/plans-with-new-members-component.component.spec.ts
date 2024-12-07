import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansWithNewMembersComponentComponent } from './plans-with-new-members-component.component';

describe('PlansWithNewMembersComponentComponent', () => {
  let component: PlansWithNewMembersComponentComponent;
  let fixture: ComponentFixture<PlansWithNewMembersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansWithNewMembersComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansWithNewMembersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
