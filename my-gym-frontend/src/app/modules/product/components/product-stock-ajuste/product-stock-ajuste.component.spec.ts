import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockAjusteComponent } from './product-stock-ajuste.component';

describe('ProductStockAjusteComponent', () => {
  let component: ProductStockAjusteComponent;
  let fixture: ComponentFixture<ProductStockAjusteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStockAjusteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStockAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
