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
  total_alunos: number;

}
