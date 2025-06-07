import {Base} from "./base";
import {Product} from "./product";


export interface Batch extends Base {

  produto: Product
  quantidade: number
  data_validade: Date
  data_entrada: Date
  preco_total: number
  preco_unitario: number

}
