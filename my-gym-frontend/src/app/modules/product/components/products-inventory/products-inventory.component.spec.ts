import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsInventoryComponent } from './products-inventory.component';

describe('ProductsInventoryComponent', () => {
  let component: ProductsInventoryComponent;
  let fixture: ComponentFixture<ProductsInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
