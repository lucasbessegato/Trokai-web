import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductCardComponent } from 'src/app/shared/components/product-card/product-card.component';
import { UserImagePipe } from 'src/app/shared/pipes/user-image.pipe';
import { Product, ProductImage, ProductStatus } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { EditProfileModalComponent } from '../../edit-profile/edit-profile.component';
import { RateUserDialogData, RateUserModalComponent } from '../../rate-user-modal/rate-user-modal.component';
import { ReputationBadgeComponent } from 'src/app/shared/components/reputation-badge/reputation-badge.component';

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
    MatDividerModule,
    ProductCardComponent,
    UserImagePipe,
    ReputationBadgeComponent,
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

  isCurrentUser: boolean = true;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.loadUserData(params['id'])
      }
      else {
        this.loadCurrentUser()
      }
    })
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

  loadUserData(id: number): void {
    this.isLoading = true;

    this.authService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isCurrentUser = false;
        this.isLoading = false;
        this.selectedAvatar = this.user.avatar;

        this.profileForm.patchValue({
          fullName: this.user.fullName,
          username: this.user.username,
          email: this.user.email,
          city: this.user.city || '',
          state: this.user.state || '',
          phone: this.user.phone || ''
        });

        this.loadUserProducts();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar usuário: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }

  loadCurrentUser(): void {
    this.isLoading = true;
    this.user = this.authService.getCurrentUser();

    if (!this.user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.selectedAvatar = this.user.avatar;

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

    this.productService.getProductsByUser(this.user.id).subscribe({
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

  selectAvatar(avatarUrl: string): void {
    this.selectedAvatar = avatarUrl;
  }

  getFirstExchanges(exchanges: string[], count: number): string[] {
    return exchanges.length
      ? exchanges.slice(0, count)
      : ['Qualquer item'];
  }

  navigateToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  editProduct(p: Product): void {
    sessionStorage.setItem('currentProduct', JSON.stringify(p))
    this.router.navigate(['/products/create'])
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(data => {
      this.snackBar.open('Produto exluído com sucesso!', 'Fechar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.loadUserProducts()
    })
  }

  getMainImageUrl(images: ProductImage[] | undefined): string {
    if (!images || images.length === 0) {
      return ''; // ou algum placeholder fixo
    }
    const mainImg = images.find(img => img.is_main);
    return mainImg ? mainImg.url : images[0].url;
  }

  editProfile(): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadCurrentUser();
      }
    });
  }

  rateUser(): void {
    const dialogRef = this.dialog.open( RateUserModalComponent, {
      width: '650px',
      data: { toUser: this.user } as RateUserDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadCurrentUser();
      }
    });
  }
}
