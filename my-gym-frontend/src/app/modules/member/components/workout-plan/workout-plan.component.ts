import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { URLS } from '../../../../app.urls';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatList, MatListItem } from '@angular/material/list';
import { MemberPlan } from '../../../../shared/interfaces/member-plan';
import { Base } from '../../../../shared/interfaces/base';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Exercicio extends Base {
  exercise: number;
  exercise_name?: string;
  sets: number;
  repetitions: number;
  observations?: string;
}

export interface WorkoutDay extends Base {
  days_of_week: string;
  day?: number;
  exercises: Exercicio[];
}

export interface WorkOutPlan extends Base {
  member_plan: number;
  workout_days: WorkoutDay[];
}

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInput,
    MatButton,
    MatList,
    MatListItem
  ],
  templateUrl: './workout-plan.component.html',
  styleUrl: './workout-plan.component.css'
})
export class WorkoutPlanComponent implements OnInit {
  public memberPlanId: string = '';
  public memberPlan: MemberPlan | undefined;
  public workoutPlan: WorkOutPlan | undefined;
  public exerciseForms: { [key: number]: FormGroup } = {};
  public exercises: { id: number; title: string }[] = [];

  readonly diasDaSemana = [
    { value: 0, label: 'Segunda-feira', backend: 'segunda' },
    { value: 1, label: 'Terça-feira', backend: 'terca' },
    { value: 2, label: 'Quarta-feira', backend: 'quarta' },
    { value: 3, label: 'Quinta-feira', backend: 'quinta' },
    { value: 4, label: 'Sexta-feira', backend: 'sexta' },
    { value: 5, label: 'Sábado', backend: 'sabado' },
    { value: 6, label: 'Domingo', backend: 'domingo' }
  ];

  constructor(
    private route: ActivatedRoute,
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.memberPlanId = this.route.snapshot.paramMap.get('action') || '';
    this.initializeForms();
    this.loadMemberData();
    this.loadWorkoutPlan().subscribe();
    this.loadExercises();
  }

  initializeForms() {
    this.diasDaSemana.forEach(dia => {
      this.exerciseForms[dia.value] = this.formBuilder.group({
        exercises: this.formBuilder.array([], Validators.required)
      });
    });
  }

  createExerciseForm(exercise?: Exercicio): FormGroup {
    return this.formBuilder.group({
      exercise: [exercise?.exercise || null, Validators.required],
      sets: [exercise?.sets || null, [Validators.required, Validators.min(1)]],
      repetitions: [exercise?.repetitions || null, [Validators.required, Validators.min(1)]],
      observations: [exercise?.observations || '']
    });
  }

  loadExercisesForDay(day: number, exercises: Exercicio[]) {
    const exercisesArray = this.getExercises(day);
    exercisesArray.clear();
    exercises.forEach(ex => {
      console.log(`Adicionando exercício para dia ${day}:`, JSON.stringify(ex, null, 2));
      exercisesArray.push(this.createExerciseForm(ex));
    });
  }

  loadMemberData(): void {
    this.httpMethods.get(`${URLS.MEMBERPLAN}?id=${this.memberPlanId}&expand=plano,aluno`).subscribe({
      next: (res: any) => {
        this.memberPlan = res.results[0];
      },
      error: err => {
        console.error('Erro ao carregar plano do aluno:', err);
        this.snackBar.open('Erro ao carregar plano do aluno', 'Fechar', { duration: 5000 });
      }
    });
  }

  loadWorkoutPlan(): Observable<WorkOutPlan | undefined> {
    return this.httpMethods.get(`${URLS.WORKOUTPLAN}?member=${this.memberPlanId}&expand=workout_days,workout_days.exercises`).pipe(
      tap((res: { results: WorkOutPlan[] }) => {
        console.log('Resposta completa de loadWorkoutPlan:', JSON.stringify(res, null, 2));
        if (res.results.length > 1) {
          console.warn(`Múltiplos WorkoutPlan encontrados para member_plan=${this.memberPlanId}:`, res.results);
          this.snackBar.open('Dados inconsistentes: múltiplos planos de treino encontrados.', 'Fechar', { duration: 5000 });
        }
        if (res.results.length > 0) {
          this.workoutPlan = res.results[0];
          this.workoutPlan.workout_days = this.workoutPlan.workout_days || [];
          const dayCounts = this.workoutPlan.workout_days.reduce((acc, w) => {
            acc[w.days_of_week] = (acc[w.days_of_week] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          for (const [day, count] of Object.entries(dayCounts)) {
            if (count > 1) {
              console.warn(`Múltiplos WorkoutDay encontrados para ${day}:`, this.workoutPlan.workout_days.filter(w => w.days_of_week === day));
              this.snackBar.open(`Dados inconsistentes: múltiplos dias encontrados para ${day}.`, 'Fechar', { duration: 5000 });
            }
          }
          console.log('WorkOutPlan carregado:', JSON.stringify(this.workoutPlan, null, 2));
          this.diasDaSemana.forEach(dia => {
            const backendDay = dia.backend;
            const workoutDay = this.workoutPlan?.workout_days.find(w => w.days_of_week === backendDay);
            console.log(`Verificando dia ${backendDay}:`, JSON.stringify(workoutDay, null, 2));
            if (workoutDay?.exercises && workoutDay.exercises.length > 0) {
              console.log(`Carregando exercícios para ${backendDay}:`, workoutDay.exercises);
              this.loadExercisesForDay(dia.value, workoutDay.exercises);
            }
          });
        } else {
          this.workoutPlan = undefined;
          console.log('Nenhum WorkOutPlan encontrado, será criado quando necessário');
        }
      }),
      map((res: { results: WorkOutPlan[] }) => res.results[0] || undefined),
      catchError(err => {
        console.error('Erro ao carregar plano de treino:', err);
        this.snackBar.open('Erro ao carregar plano de treino', 'Fechar', { duration: 5000 });
        return of(undefined);
      })
    );
  }

  loadExercises(): void {
    this.httpMethods.get(`${URLS.EXERCISE}`).subscribe({
      next: (res) => {
        this.exercises = res.results;
      },
      error: err => {
        console.error('Erro ao carregar exercícios:', err);
        this.snackBar.open('Erro ao carregar exercícios', 'Fechar', { duration: 5000 });
      }
    });
  }

  getExercises(day: number): FormArray {
    return this.exerciseForms[day].get('exercises') as FormArray;
  }

  addExerciseToForm(day: number) {
    const exercises = this.getExercises(day);
    exercises.push(this.createExerciseForm());
  }

  removeExercise(day: number, index: number) {
    const exercises = this.getExercises(day);
    exercises.removeAt(index);
  }

  saveWorkoutDay(day: number) {
    const form = this.exerciseForms[day];
    if (form.invalid) {
      this.snackBar.open('Preencha todos os campos obrigatórios!', 'Fechar', { duration: 5000 });
      form.markAllAsTouched();
      console.log('Formulário inválido:', form.value);
      console.log('Erros do formulário:', form.errors);
      return;
    }

    const backendDay = this.diasDaSemana.find(d => d.value === day)?.backend;
    if (!backendDay) {
      this.snackBar.open('Dia da semana inválido!', 'Fechar', { duration: 5000 });
      return;
    }

    const formValue = form.value;
    if (!formValue.exercises.length) {
      this.snackBar.open('Adicione pelo menos um exercício!', 'Fechar', { duration: 5000 });
      return;
    }

    const invalidExercises = formValue.exercises.filter(
      (ex: any) => !ex.exercise || ex.sets == null || ex.repetitions == null
    );
    if (invalidExercises.length > 0) {
      this.snackBar.open('Alguns exercícios estão incompletos!', 'Fechar', { duration: 5000 });
      console.log('Exercícios inválidos:', invalidExercises);
      return;
    }

    console.log('Formulário válido, enviando:', JSON.stringify(formValue, null, 2));

    this.loadWorkoutPlan().subscribe({
      next: (workoutPlan) => {
        if (workoutPlan) {
          this.workoutPlan = workoutPlan;
          console.log('Usando WorkOutPlan existente:', this.workoutPlan.id);
        } else {
          console.log('Criando novo WorkOutPlan...');
          this.httpMethods.post(`${URLS.WORKOUTPLAN}`, { member_plan: parseInt(this.memberPlanId) }).subscribe({
            next: (res: HttpResponse<WorkOutPlan>) => {
              const newWorkoutPlan = res.body;
              if (newWorkoutPlan) {
                console.log('WorkOutPlan criado:', newWorkoutPlan);
                this.workoutPlan = newWorkoutPlan;
                this.workoutPlan.workout_days = this.workoutPlan.workout_days || [];
                this.createWorkoutDayAndExercises(day, formValue);
              }
            },
            error: err => {
              console.error('Erro ao criar plano de treino:', err);
              this.snackBar.open('Erro ao criar plano de treino', 'Fechar', { duration: 5000 });
            }
          });
          return;
        }

        console.log('WorkoutDays atuais:', JSON.stringify(this.workoutPlan.workout_days, null, 2));
        const localWorkoutDay = this.workoutPlan.workout_days.find(w => w.days_of_week === backendDay);
        if (localWorkoutDay) {
          console.log('Atualizando WorkoutDay local:', localWorkoutDay.id);
          this.updateWorkoutDay(localWorkoutDay.id, formValue);
        } else {
          console.log('Criando novo WorkoutDay para:', backendDay);
          this.createWorkoutDayAndExercises(day, formValue);
        }
      },
      error: err => {
        console.error('Erro ao verificar WorkoutPlan:', err);
        this.snackBar.open('Erro ao verificar plano de treino', 'Fechar', { duration: 5000 });
      }
    });
  }

  createWorkoutDayAndExercises(day: number, formValue: any) {
    const backendDay = this.diasDaSemana.find(d => d.value === day)?.backend;
    if (!backendDay) {
      this.snackBar.open('Dia da semana inválido!', 'Fechar', { duration: 5000 });
      return;
    }

    const exercises = formValue.exercises.map((ex: any) => ({
      exercise: ex.exercise,
      sets: ex.sets,
      repetitions: ex.repetitions,
      observations: ex.observations || ''
    }));

    const workoutDayPayload = {
      workout_plan: this.workoutPlan!.id,
      days_of_week: backendDay,
      exercises: exercises
    };
    console.log('Payload enviado para POST /api/aluno/days/:', JSON.stringify(workoutDayPayload, null, 2));

    this.httpMethods.post(`${URLS.DAYS}`, workoutDayPayload).subscribe({
      next: (res: HttpResponse<WorkoutDay>) => {
        const workoutDay = res.body;
        if (workoutDay) {
          console.log('WorkoutDay criado com sucesso:', JSON.stringify(workoutDay, null, 2));
          this.workoutPlan!.workout_days = this.workoutPlan!.workout_days.filter(w => w.days_of_week !== backendDay);
          this.workoutPlan!.workout_days.push(workoutDay);
          this.loadExercisesForDay(day, workoutDay.exercises || []);
          this.snackBar.open('Dia de treino salvo com sucesso!', 'Fechar', { duration: 5000 });
        }
      },
      error: err => {
        console.error('Erro ao criar WorkoutDay:', err);
        console.error('Detalhes do erro:', JSON.stringify(err.error, null, 2));
        this.snackBar.open(`Erro ao criar dia de treino: ${err.error?.detail || JSON.stringify(err.error)}`, 'Fechar', { duration: 5000 });
      }
    });
  }

  updateWorkoutDay(workoutDayId: number, formValue: any) {
    const existingWorkoutDay = this.workoutPlan!.workout_days.find(w => w.id === workoutDayId);
    if (!existingWorkoutDay) {
      this.snackBar.open('WorkoutDay não encontrado!', 'Fechar', { duration: 5000 });
      console.error(`WorkoutDay ID ${workoutDayId} não encontrado em workout_days:`, JSON.stringify(this.workoutPlan!.workout_days, null, 2));
      return;
    }

    const backendDay = existingWorkoutDay.days_of_week;
    const dayIndex = this.diasDaSemana.find(d => d.backend === backendDay)?.value;
    if (dayIndex === undefined) {
      this.snackBar.open('Dia da semana inválido!', 'Fechar', { duration: 5000 });
      console.error(`Dia da semana inválido: ${backendDay}`);
      return;
    }

    const exercises = formValue.exercises.map((ex: any) => ({
      exercise: ex.exercise,
      sets: ex.sets,
      repetitions: ex.repetitions,
      observations: ex.observations || ''
    }));

    const workoutDayPayload = {
      id: workoutDayId,
      workout_plan: this.workoutPlan!.id,
      exercises: exercises // Não enviar days_of_week para evitar alterações
    };
    console.log(`Payload enviado para PATCH /api/aluno/days/${workoutDayId}/:`, JSON.stringify(workoutDayPayload, null, 2));
    console.log('id do workoutDay:', workoutDayId, 'backendDay:', backendDay);

    this.httpMethods.patch(`${URLS.DAYS}`, workoutDayPayload).subscribe({
      next: (res: HttpResponse<WorkoutDay>) => {
        const workoutDay = res.body;
        if (workoutDay) {
          console.log('WorkoutDay atualizado:', JSON.stringify(workoutDay, null, 2));
          this.workoutPlan!.workout_days = this.workoutPlan!.workout_days.filter(w => w.id !== workoutDayId);
          this.workoutPlan!.workout_days.push(workoutDay);
          this.loadExercisesForDay(dayIndex, workoutDay.exercises || []);
          this.snackBar.open('Dia de treino atualizado com sucesso!', 'Fechar', { duration: 5000 });
        }
      },
      error: err => {
        console.error(`Erro ao atualizar WorkoutDay ID ${workoutDayId}:`, err);
        console.error('Detalhes do erro:', JSON.stringify(err.error, null, 2));
        this.snackBar.open(`Erro ao atualizar dia de treino: ${err.error?.detail || JSON.stringify(err.error)}`, 'Fechar', { duration: 5000 });
      }
    });
  }

  getExercisesByDay(day: number): Exercicio[] {
    const backendDay = this.diasDaSemana.find(d => d.value === day)?.backend;
    if (!this.workoutPlan || !this.workoutPlan.workout_days || !backendDay) {
      return [];
    }
    return this.workoutPlan.workout_days.find(w => w.days_of_week === backendDay)?.exercises || [];
  }

  isDayAllowed(day: number): boolean {
    return this.memberPlan?.plano?.dias_permitidos?.includes(day) ?? false;
  }

  trackByExercise(index: number, ex: Exercicio): string {
    return ex.id ? ex.id.toString() : index.toString();
  }
}
