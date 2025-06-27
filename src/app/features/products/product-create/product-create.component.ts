import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { forkJoin } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';

import { ProductService } from '../../../core/services/product.service';
import { Category, ProductImage, ProductStatus } from '../../../core/models/product.model';

interface UploadImage {
  file: File;
  isMain: boolean;
  previewUrl: string;
}

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isSubmitting = false;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  acceptableExchanges: string[] = [];

  // Gerenciamento de imagens
  uploadedImages: UploadImage[] = [];
  mainImageIndex: number = 0;
  imagePreviewUrls: string[] = [];

  // Variáveis para controle de upload
  dragAreaClass: string = 'dragarea';
  maxFiles: number = 5;
  editingProduct: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const storedProduct = sessionStorage.getItem('currentProduct');
    if (storedProduct) {
      this.editingProduct = JSON.parse(storedProduct);
    }

    this.initForm();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('currentProduct')
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      categoryId: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (categories.length > 0 && !this.editingProduct) {
          this.productForm.patchValue({ categoryId: categories[0].id });
        }
        if (this.editingProduct) {
          this.acceptableExchanges = this.editingProduct.acceptable_exchanges;

          // Aguarda conversão das imagens
          this.convertImagesFromUrls(this.editingProduct.images).then((converted) => {
            this.uploadedImages = converted;
            this.imagePreviewUrls = converted.map(img => img.previewUrl);
            this.mainImageIndex = this.uploadedImages.findIndex(img => img.isMain) || 0;

            this.productForm.patchValue({
              title: this.editingProduct.title,
              description: this.editingProduct.description,
              categoryId: this.editingProduct.category.id,
              imageUrl: converted[this.mainImageIndex]?.previewUrl || ''
            });
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar categorias: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }

  addExchangeItem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.acceptableExchanges.push(value);
    }

    event.chipInput!.clear();
  }

  removeExchangeItem(item: string): void {
    const index = this.acceptableExchanges.indexOf(item);

    if (index >= 0) {
      this.acceptableExchanges.splice(index, 1);
    }
  }

  // Métodos para gerenciamento de imagens
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragAreaClass = 'dragarea dragover';
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragAreaClass = 'dragarea';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragAreaClass = 'dragarea';

    if (event.dataTransfer && event.dataTransfer.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList): void {
    if (this.uploadedImages.length + files.length > this.maxFiles) {
      this.snackBar.open(`Você pode enviar no máximo ${this.maxFiles} imagens`, 'Fechar', {
        duration: 3000
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        this.snackBar.open('Somente imagens são permitidas (JPEG, PNG, GIF, WEBP)', 'Fechar', {
          duration: 3000
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const preview = e.target?.result as string;
        const isMain = this.uploadedImages.length === 0;

        this.uploadedImages.push({ file, isMain, previewUrl: preview });
        this.imagePreviewUrls.push(preview);

        if (isMain) {
          this.setMainImage(0);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  setMainImage(index: number): void {
    this.uploadedImages.forEach(img => img.isMain = false);
    this.uploadedImages[index].isMain = true;
    this.mainImageIndex = index;
    this.productForm.patchValue({
      imageUrl: this.uploadedImages[index].previewUrl
    });
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);

    if (index === this.mainImageIndex) {
      if (this.uploadedImages.length > 0) {
        this.setMainImage(0);
      } else {
        this.mainImageIndex = 0;
        this.productForm.patchValue({ imageUrl: '' });
      }
    } else if (index < this.mainImageIndex) {
      this.mainImageIndex--;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      return;
    }

    if (this.acceptableExchanges.length === 0) {
      this.snackBar.open('Por favor, adicione pelo menos um item que você aceitaria em troca.', 'Fechar', {
        duration: 5000
      });
      return;
    }

    if (this.uploadedImages.length === 0) {
      this.snackBar.open('Por favor, adicione pelo menos uma imagem do produto.', 'Fechar', {
        duration: 5000
      });
      return;
    }

    this.isSubmitting = true;

    const productData = {
      title: this.productForm.value.title,
      description: this.productForm.value.description,
      category: this.productForm.value.categoryId,
      acceptableExchanges: this.acceptableExchanges,
      status: ProductStatus.AVAILABLE
    };

    if (this.editingProduct) {
      this.productService.updateProduct(productData, this.editingProduct.id).pipe(
        switchMap(product =>
          forkJoin(
            this.uploadedImages.map(img => {
              const form = new FormData();
              form.append('image_file', img.file);
              form.append('is_main', String(img.isMain));
              return this.productService.uploadProductImage(product.id, form);
            })
          ).pipe(mapTo(product))
        )
      ).subscribe({
        next: (product) => {
          this.isSubmitting = false;
          this.snackBar.open('Produto anunciado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Erro ao anunciar produto: ' + error.message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
      sessionStorage.removeItem('currentProduct')
    }
    else {
      this.productService.createProduct(productData).pipe(
        switchMap(product =>
          forkJoin(
            this.uploadedImages.map(img => {
              const form = new FormData();
              form.append('image_file', img.file);
              form.append('is_main', String(img.isMain));
              return this.productService.uploadProductImage(product.id, form);
            })
          ).pipe(mapTo(product))
        )
      ).subscribe({
        next: (product) => {
          this.isSubmitting = false;
          this.snackBar.open('Produto anunciado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Erro ao anunciar produto: ' + error.message, 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  async urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  }

  async convertImagesFromUrls(images: any[]): Promise<UploadImage[]> {
    const converted = await Promise.all(
      images.map(async (img, index) => {
        const file = await this.urlToFile(img.url, `image${index + 1}.jpg`);
        return {
          file,
          isMain: img.is_main,
          previewUrl: img.url
        };
      })
    );
    return converted;
  }
}
