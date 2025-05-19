import {Base} from "./base";

export interface Product extends Base{

  nome?: string;
  descricao?: string;
  preco: number;
  foto_url?: ImageData;
  categoria?: string;
  academia: number;
  data_cadastro?: Date;
  quantidade_estoque?: number;
  created_at: Date;
  modified_at: Date;
  lotes?: Lote[]
  marca?: string;

}


export interface Lote extends Base{

  quantidade?: number;
  data_validade: Date;
  data_entrada: Date;
  preco_total?: number;
  preco_unitario?: number;
}

