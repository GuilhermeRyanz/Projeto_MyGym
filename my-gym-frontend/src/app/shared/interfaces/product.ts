
export interface Product{

  id?: number;
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


export interface Lote{

  id: number;
  produto: number;
  created_at: Date;
  modified_at: Date;
  active: boolean;
  quantidade?: number;
  data_validade: Date;
  data_entrada: Date;
}

