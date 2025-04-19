import {Member} from "./member";
import {Plan} from "./plan";

export interface MemberPlan {

  id: number;
  aluno: Member;
  active: boolean;
  created_at: Date;
  plano: Plan;

}
