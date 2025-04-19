import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellPageComponent } from './sell-page.component';

describe('SellPageComponent', () => {
  let component: SellPageComponent;
  let fixture: ComponentFixture<SellPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
