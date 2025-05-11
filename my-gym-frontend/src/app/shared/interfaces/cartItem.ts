import { Product } from './product';

export interface CartItem {
  produto: Product;
  quantidade: number;
  preco_unitario: number;
}
