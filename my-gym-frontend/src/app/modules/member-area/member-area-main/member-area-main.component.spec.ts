import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAreaMainComponent } from './member-area-main.component';

describe('MemberAreaMainComponent', () => {
  let component: MemberAreaMainComponent;
  let fixture: ComponentFixture<MemberAreaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAreaMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberAreaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
