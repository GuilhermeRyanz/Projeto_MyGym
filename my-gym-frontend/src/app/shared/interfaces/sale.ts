import { Base } from './base';
import { Employee } from './employee';
import { Member } from './member';
import { Product } from './product';

export interface Sale extends Base {
  academia?: number;
  vendedor?: Employee | null;
  cliente?: Member | null;
  valor_total?: number;
  data_venda?: string;
  forma_pagamento?: string;
  itens: Item[];
}

export interface Item extends Base {
  produto: Product;
  preco_unitario?: string;
  quantidade: number;
}
