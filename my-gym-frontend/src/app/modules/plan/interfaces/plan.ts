import {Benefits} from "./benefits";

export interface Plan {

  id: number;
  nome: string;
  preco: number;
  descricao: string;
  duracao: number;
  academia: number;
  beneficia?: Benefits;


}
