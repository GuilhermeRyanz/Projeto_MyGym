import { Base } from "./base";

export interface Plan extends Base{

  nome: string;
  preco: number;
  descricao: string;
  duracao: number;
  academia: number;
  beneficios: any[];
  dias_permitidos?: number[];
  desconto: number;
  dias_permitidos_str?: string;
  total_alunos: number;

}
