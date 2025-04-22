import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockModalComponent } from './product-stock-modal.component';

describe('ProductStockModalComponent', () => {
  let component: ProductStockModalComponent;
  let fixture: ComponentFixture<ProductStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStockModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
