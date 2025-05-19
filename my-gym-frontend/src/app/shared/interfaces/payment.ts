import {MemberPlan} from "./member-plan";
import {Base} from "./base";

export interface Payment extends Base {
  aluno_plano: MemberPlan;
  data_pagamento?: string;
  data_vencimento?: string;
  tipo_pagamento: string;
  valor?: number;
}
