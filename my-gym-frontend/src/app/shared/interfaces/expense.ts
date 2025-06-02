// import { Base } from "./base";
//
// export interface Gym extends Base{

import {Base} from "./base";

export interface Expense extends Base{
  tipo: string,
  descricao: string,
  valor: number,
  date: Date
}
