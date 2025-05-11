import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectModalComponent } from './product-select-modal.component';

describe('ProductSelectModalComponent', () => {
  let component: ProductSelectModalComponent;
  let fixture: ComponentFixture<ProductSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSelectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
