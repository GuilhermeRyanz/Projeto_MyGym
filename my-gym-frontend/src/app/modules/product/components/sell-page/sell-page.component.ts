import { Component, OnInit } from '@angular/core';
import { URLS } from '../../../../app.urls';
import { CartItem } from '../../../../shared/interfaces/cartItem';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../auth/services/auth.service';
import { ProductSelectModalComponent } from '../product-select-modal/product-select-modal.component';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CurrencyPipe, NgForOf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MemberPlan } from '../../../../shared/interfaces/member-plan';
import { debounceTime, Subject, distinctUntilChanged } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-sell-page',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatButton,
    CurrencyPipe,
    MatInput,
    MatLabel,
    MatCard,
    MatAutocompleteTrigger,
    MatAutocomplete,
  ],
  templateUrl: './sell-page.component.html',
  styleUrls: ['./sell-page.component.css']
})
export class SellPageComponent implements OnInit {
  private pathUrl: string = URLS.SALE;
  private pathUrMembers: string = URLS.MEMBERPLAN;
  public cartItems: CartItem[] = [];
  public members: MemberPlan[] = [];
  public formGroup: FormGroup;
  public selectedMember: MemberPlan | null = null;
  public desc: number = 0;
  public searchTerm: string = '';
  public formasPagamento: string[] = ['Dinheiro', 'Cartão', 'Pix'];

  searchChange = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public authService: AuthService,
    public httpMethods: HttpMethodsService
  ) {
    this.formGroup = this.formBuilder.group({
      client: [null],
      formaPagamento: ['Dinheiro', Validators.required],
    });
  }

  ngOnInit() {
    this.search();
    this.searchChange.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.searchMember(term);
    });
  }

  public searchMember(term: string = ''): void {
    const params: any = {
      expand: ['aluno', 'plano'],
      active: true,
      academia: this.authService.get_gym(),
    };

    if (term) {
      params.search = term;
    }

    this.httpMethods.getPaginated(this.pathUrMembers, params).subscribe({
      next: (response: any) => {
        this.members = response.results;
        if (this.selectedMember && !this.members.find(m => m.id === this.selectedMember!.id)) {
          this.selectedMember = null;
          this.desc = 0;
          this.formGroup.get('client')?.setValue(null);
          this.snackBar.open('Membro selecionado não está mais disponível.', 'Fechar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar membros:', err);
        this.snackBar.open('Erro ao carregar membros.', 'Fechar', { duration: 3000 });
      }
    });
  }

  public search(): void {
    this.searchMember(this.searchTerm);
  }

  public openProductModal(): void {
    const dialogRef = this.dialog.open(ProductSelectModalComponent, {
      width: '600px',
      data: { academia: this.authService.get_gym(), cartItems: this.cartItems },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.produto && result.quantidade) {
        const existingItem = this.cartItems.find(item => item.produto.id === result.produto.id);
        if (existingItem) {
          existingItem.quantidade += result.quantidade;
        } else {
          this.cartItems.push({
            produto: result.produto,
            quantidade: result.quantidade,
            preco_unitario: result.produto.preco || result.preco_unitario
          });
        }
        this.snackBar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 3000 });
      }
    });
  }

  removeItem(item: CartItem): void {
    const index = this.cartItems.findIndex(cartItem => cartItem.produto.id === item.produto.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.snackBar.open('Produto removido do carrinho.', 'Fechar', { duration: 3000 });
    } else {
      console.error('Item não encontrado:', item);
      this.snackBar.open('Erro ao remover item.', 'Fechar', { duration: 3000 });
    }
  }

  getTotal(): number {
    const desc = this.selectedMember?.plano?.desconto || 0;
    const subtotal = this.cartItems.reduce((total, item) => {
      const preco = Number(item.preco_unitario) || 0;
      return total + (preco * item.quantidade);
    }, 0);
    return subtotal * (1 - desc / 100);
  }

  finalizeSale(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Adicione produtos ao carrinho antes de finalizar a venda.', 'Fechar', { duration: 3000 });
      return;
    }

    const saleData = {
      academia: this.authService.get_gym(),
      cliente: this.formGroup.get('client')?.value,
      forma_pagamento: this.formGroup.get('formaPagamento')?.value,
      itens: this.cartItems.map(item => ({
        produto: item.produto.id,
        quantidade: item.quantidade,
        preco_unitario: Number(item.preco_unitario),
        valor_total: Number(item.preco_unitario) * item.quantidade
      }))
    };

    this.httpMethods.post(this.pathUrl, saleData).subscribe({
      next: () => {
        this.snackBar.open('Venda finalizada com sucesso!', 'Fechar', { duration: 3000 });
        this.cartItems = [];
        this.formGroup.reset({ formaPagamento: 'Dinheiro' });
        this.selectedMember = null;
        this.desc = 0;
        this.goBack();
      },
      error: (err) => {
        console.error('Erro ao finalizar venda:', err);
        this.snackBar.open('Erro ao finalizar venda: ' + (err.error?.error || 'Tente novamente'), 'Fechar', { duration: 5000 });
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.next(term);
  }

  public displayMemberFn(member: MemberPlan | null): string {
    return member && member.aluno ? `${member.aluno.matricula} - ${member.aluno.nome}` : '';
  }

  public onMemberSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedMember = event.option.value as MemberPlan;
    if (selectedMember) {
      this.selectedMember = selectedMember;
      this.desc = selectedMember.plano?.desconto || 0;
      this.formGroup.get('client')?.setValue(selectedMember.aluno.id);
      console.log('Aluno selecionado:', selectedMember);
    } else {
      this.selectedMember = null;
      this.desc = 0;
      this.formGroup.get('client')?.setValue(null);
    }
  }

  public get clientControl(): FormControl {
    return this.formGroup.get('client') as FormControl;
  }

  goBack(): void {
    this.router.navigate(['/product/sales']);
  }
}
