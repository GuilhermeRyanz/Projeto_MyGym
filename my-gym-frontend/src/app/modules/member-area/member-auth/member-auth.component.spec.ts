import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAuthComponent } from './member-auth.component';

describe('MemberAuthComponent', () => {
  let component: MemberAuthComponent;
  let fixture: ComponentFixture<MemberAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
