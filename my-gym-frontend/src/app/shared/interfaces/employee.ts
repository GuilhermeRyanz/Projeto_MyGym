import {Base} from "./base";

export interface Employee extends Base{

  nome: string;
  username: string;
  tipo_usuario: string;
  data_de_contratacao?: string;

}
