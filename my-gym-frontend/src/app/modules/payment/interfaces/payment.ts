import {MemberPlan} from "../../member/interfaces/member-plan";

export interface Payment {
  "id": number;
  aluno_plano: MemberPlan;
  data_pagamento?: string;
  data_vencimento?: string;
  tipo_pagamento: string;
  valor?: number;
}
