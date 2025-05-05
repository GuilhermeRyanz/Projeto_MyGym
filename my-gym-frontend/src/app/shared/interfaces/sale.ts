import { Employee } from './employee';
import { Member } from './member';
import { Product } from './product';

export interface Sale {
  id: number;
  academia?: number;
  vendedor?: Employee | null;
  cliente?: Member | null;
  valor_total?: number;
  data_venda?: string;
  items: Item[];
}

export interface Item {
  id?: number;
  produto: Product;
  preco_unitario?: string;
  quantidade: number;
}
