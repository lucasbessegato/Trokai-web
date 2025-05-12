import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Product, Category, ProductStatus } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  products: Product[] = [];
  profileForm!: FormGroup;
  isLoading = true;
  isEditMode = false;
  isSaving = false;
  productStatus = ProductStatus;
  
  // Avatar options for selection
  avatarOptions = [
    'https://images.unsplash.com/photo-1630910561339-4e22c7150093',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'https://images.unsplash.com/photo-1646617747609-45b466ace9a6',
    'https://images.unsplash.com/photo-1628891435222-065925dcb365',
    'https://images.unsplash.com/photo-1507499036636-f716246c2c23',
    'https://images.unsplash.com/photo-1601388352547-2802c6f32eb8'
  ];
  
  selectedAvatar = '';
  reputationBadgeInfo: any;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }
  
  initForm(): void {
    this.profileForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9_-]*$')]],
      email: [{ value: '', disabled: true }],
      city: [''],
      state: [''],
      phone: ['', [Validators.pattern('^[0-9]+$')]]
    });
  }
  
  loadUserData(): void {
    this.isLoading = true;
    
    this.user = this.authService.getCurrentUser();
    
    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.selectedAvatar = this.user.avatar;
    this.reputationBadgeInfo = this.userService.getReputationBadgeInfo(this.user.reputationLevel);
    
    this.profileForm.patchValue({
      fullName: this.user.fullName,
      username: this.user.username,
      email: this.user.email,
      city: this.user.city || '',
      state: this.user.state || '',
      phone: this.user.phone || ''
    });
    
    this.loadUserProducts();
  }
  
  
  loadUserProducts(): void {
    if (!this.user) return;
    
    this.productService.getProductsByUser(2).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar produtos: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    if (!this.isEditMode) {
      this.loadUserData();
    }
  }
  
  selectAvatar(avatarUrl: string): void {
    this.selectedAvatar = avatarUrl;
  }
  
  saveProfile(): void {
    if (this.profileForm.invalid || this.isSaving) {
      return;
    }
    
    this.isSaving = true;
    
    const updatedUserData = {
      ...this.profileForm.getRawValue(),
      avatar: this.selectedAvatar
    };
    
    this.userService.updateUserProfile(updatedUserData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isSaving = false;
        this.isEditMode = false;
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.snackBar.open('Erro ao atualizar perfil: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getFirstExchanges(exchanges: string[], count: number): string[] {
    return exchanges.length
      ? exchanges.slice(0, count)
      : ['Qualquer item'];
  }

  getReputationStars(level: number): number[] {
    return Array(level).fill(0);
  }

  getEmptyStars(level: number): number[] {
    return Array(Math.max(0, 5 - level)).fill(0);
  }
  
  navigateToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
