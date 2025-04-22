import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { URLS } from '../../../../app.urls';
import { HttpMethodsService } from '../../../../shared/services/httpMethods/http-methods.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  public action: String = "";
  private created: boolean = true;
  public pathUrlProd: string = URLS.PRODUCT;
  protected formGroup: FormGroup;
  private gymId: string | null = "";
  public title: string = "Cadastro de produto";
  public selectedImage: File | null = null;
  public imagePreviewUrl: string | null = null;

  constructor(
    private httpMethods: HttpMethodsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      id: [],
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      descricao: ['', Validators.required],
      academia: [''],
      quantidade_estoque: ['', Validators.required],
      created_at: [''],
      modified_at: [''],
      marca: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getGym();
    this.retriveCallBack();
  }

  getGym(): void {
    this.gymId = localStorage.getItem("academia");
    if (this.gymId) {
      this.formGroup.patchValue({ academia: this.gymId });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edição de produto";
        this.httpMethods.get(this.pathUrlProd + this.action + '/').subscribe((response) => {
          this.imagePreviewUrl = response.foto;
          console.log(response);
          this.formGroup.patchValue({
            id: response.id,
            nome: response.nome,
            preco: response.preco,
            descricao: response.descricao,
            quantidade_estoque: response.quantidade_estoque,
            created_at: response.created_at,
            modified_at: response.modified_at,
            marca: response.marca,
            academia: this.gymId
          });
        });
      }
    });
  }

  public saveOrUpdate(product: any) {
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (product[key] !== null && product[key] !== undefined) {
        formData.append(key, product[key]);
      }
    });

    const request = this.created
      ? this.httpMethods.post(`${this.pathUrlProd}`, formData)
      : this.httpMethods.noIdPatch(`${this.pathUrlProd}${product.id}/`, formData);

    request.subscribe(() => {
      const message = this.created ? 'Produto cadastrado' : 'Produto atualizado';
      this.snackBar.open(message, 'OK', {
        duration: 3000,
        verticalPosition: 'top',
      });
      this.router.navigate(['/product/productInventory']);
    });
  }
}
