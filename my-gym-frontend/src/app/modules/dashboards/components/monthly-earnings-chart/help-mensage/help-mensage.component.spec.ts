import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMensageComponent } from './help-mensage.component';

describe('HelpMensageComponent', () => {
  let component: HelpMensageComponent;
  let fixture: ComponentFixture<HelpMensageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpMensageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpMensageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
