
export interface Plan {

  id: number;
  nome: string;
  preco: number;
  descricao: string;
  duracao: number;
  academia: number;
  beneficios: any[];
  dias_permitidos?: number[];
  desconto: number;
  dias_permitidos_str?: string;

}
