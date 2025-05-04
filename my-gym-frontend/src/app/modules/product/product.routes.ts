import {Routes} from "@angular/router";
import {SellPageComponent} from "./components/sell-page/sell-page.component";
import {ProductInventoryComponent} from "./components/product-inventory/products-inventory.component";
import {ProductFormComponent} from "./components/product-form/product-form.component";
import {SalesComponent} from "./components/sales/sales.component";

export const routes: Routes = [
  {
    path: "productInventory",
    component: ProductInventoryComponent
  },

  {
    path: "sellPage",
    component: SellPageComponent
  },

  {
    path:  "form/:action",
    component: ProductFormComponent
  },

  {
    path: "sales",
    component: SalesComponent
  }

]
