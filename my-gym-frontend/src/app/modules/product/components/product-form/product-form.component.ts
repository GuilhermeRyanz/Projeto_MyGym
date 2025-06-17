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
import {MatOption, MatSelect} from "@angular/material/select";
import {ProductStockAjusteComponent} from "../product-stock-ajuste/product-stock-ajuste.component";

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
    MatSelect,
    MatOption,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  public categorias = [
    { value: 'SUPLEMENTO', label: 'Suplemento' },
    { value: 'ACESSORIO', label: 'Acessório' },
    { value: 'ROUPA', label: 'Roupa' },
    { value: 'BEBIDA', label: 'Bebida' },
    { value: 'ALIMENTO', label: 'Alimento' },
    { value: 'OUTROS', label: 'Outros' },
    {value: 'EQUIPAMENTO', label: "Equipamento"},
  ];


  public action: String = "";
  public created: boolean = true;
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
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      preco: ['', [Validators.required, Validators.min(0)]],
      descricao: ['', [Validators.required, Validators.maxLength(100)]],
      academia: [''],
      categoria: ['', Validators.required],
      created_at: [''],
      modified_at: [''],
      marca: ['', [Validators.required, Validators.maxLength(100)]],
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      this.resizeImage(file, 500, 500).then(resizedFile => {
        this.selectedImage = resizedFile;
      });
    }
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;
          const ratio = Math.min(maxWidth / width, maxHeight / height);

          canvas.width = width * ratio;
          canvas.height = height * ratio;

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(blob => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject('Erro ao redimensionar imagem.');
            }
          }, file.type);
        };
      };

      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }


  public retriveCallBack() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.action = <string>params.get('action');
      this.created = !(this.action && this.action !== 'create');

      if (!this.created) {
        this.title = "Edição de produto";
        this.httpMethods.get(this.pathUrlProd + this.action + '/').subscribe((response) => {
          this.imagePreviewUrl = response.foto;
          this.formGroup.patchValue({
            id: response.id,
            nome: response.nome,
            preco: response.preco,
            descricao: response.descricao,
            categoria: response.categoria,
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

    if (this.selectedImage) {
      formData.append('foto', this.selectedImage);
    }

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

  openAdjustStockModal() {
    const dialogRef = this.dialog.open(ProductStockAjusteComponent, {
      data: { produtoId: this.formGroup.get('id')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.estoqueAjustado) {
        this.snackBar.open('Estoque ajustado com sucesso!', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }



}
