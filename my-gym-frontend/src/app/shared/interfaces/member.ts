import { Base } from "./base";
import {Plan} from "./plan";

export interface Member extends Base{

  nome: string
  email: string
  telefone: string
  matricula: string
  data_nacimento: string
  plano?: Plan
  academia?: string

}
