import {Routes} from "@angular/router";
import {ProductsInventoryComponent} from "./components/products-inventory/products-inventory.component";
import {SellPageComponent} from "./components/sell-page/sell-page.component";

export const routes: Routes = [
  {
    path: "productsInventory",
    component: ProductsInventoryComponent
  },

  {
    path: "sellPage",
    component: SellPageComponent
  }

]
