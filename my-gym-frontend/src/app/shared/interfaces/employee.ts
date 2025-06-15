import {Base} from "./base";

export interface Employee extends Base{

  nome: string;
  username: string;
  password?: string;
  tipo_usuario: string;
  data_de_contratacao?: string;

}
