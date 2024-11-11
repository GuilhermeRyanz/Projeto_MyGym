import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGymComponent } from './form-gym.component';

describe('FormGymComponent', () => {
  let component: FormGymComponent;
  let fixture: ComponentFixture<FormGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGymComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
