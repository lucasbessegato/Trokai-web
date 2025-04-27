import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

import { ProductService } from '../../../core/services/product.service';
import { Category, ProductImage } from '../../../core/models/product.model';

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
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isSubmitting = false;
  
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  acceptableExchanges: string[] = [];
  
  // Gerenciamento de imagens
  uploadedImages: ProductImage[] = [];
  mainImageIndex: number = 0;
  imagePreviewUrls: string[] = [];
  
  // Variáveis para controle de upload
  dragAreaClass: string = 'dragarea';
  maxFiles: number = 5;
  
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }
  
  initForm(): void {
    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      categoryId: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }
  
  loadCategories(): void {
    this.isLoading = true;
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (categories.length > 0) {
          this.productForm.patchValue({ categoryId: categories[0].id });
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
        if (e.target && e.target.result) {
          const imageUrl = e.target.result as string;
          const isMain = this.uploadedImages.length === 0;
          
          this.uploadedImages.push({
            url: imageUrl,
            isMain
          });
          
          this.imagePreviewUrls.push(imageUrl);
          
          if (isMain) {
            this.setMainImage(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }
  
  setMainImage(index: number): void {
    // Remover a marca de principal de todas as imagens
    this.uploadedImages.forEach(img => img.isMain = false);
    
    // Definir a imagem selecionada como principal
    this.uploadedImages[index].isMain = true;
    this.mainImageIndex = index;
    
    // Atualizar o campo do formulário com a URL da imagem principal
    this.productForm.patchValue({ 
      imageUrl: this.uploadedImages[index].url 
    });
  }
  
  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
    
    // Se removemos a imagem principal, precisamos redefinir
    if (index === this.mainImageIndex) {
      if (this.uploadedImages.length > 0) {
        this.setMainImage(0);
      } else {
        this.mainImageIndex = 0;
        this.productForm.patchValue({ imageUrl: '' });
      }
    } else if (index < this.mainImageIndex) {
      // Ajustar o índice da imagem principal se removemos uma imagem antes dela
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
    
    this.isSubmitting = true;
    
    if (this.uploadedImages.length === 0) {
      this.snackBar.open('Por favor, adicione pelo menos uma imagem do produto.', 'Fechar', {
        duration: 5000
      });
      return;
    }

    const productData = {
      ...this.productForm.value,
      acceptableExchanges: this.acceptableExchanges,
      images: this.uploadedImages
    };
    
    this.productService.createProduct(productData).subscribe({
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
