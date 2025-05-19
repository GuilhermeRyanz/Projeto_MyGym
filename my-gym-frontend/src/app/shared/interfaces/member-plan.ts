import {Member} from "./member";
import {Plan} from "./plan";
import {Base} from "./base";

export interface MemberPlan extends Base {

  aluno: Member;
  plano: Plan;
  data_vencimento: Date;

}
