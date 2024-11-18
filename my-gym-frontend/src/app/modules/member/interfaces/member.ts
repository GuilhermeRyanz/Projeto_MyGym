import {Plan} from "../../plan/interfaces/plan";

export interface Member {

  id: number
  nome: string
  email: string
  telefone: string
  matricula: string
  data_nacimento: string
  plano?: Plan

}
