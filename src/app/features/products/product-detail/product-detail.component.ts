import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ProductImagePipe } from 'src/app/shared/pipes/product-image.pipe';
import { UserImagePipe } from 'src/app/shared/pipes/user-image.pipe';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    ProductImagePipe,
    UserImagePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  userProducts: Product[] = [];
  selectedProductForExchange: number | null = null;
  isLoading = true;
  isExchangeFormVisible = false;
  exchangeForm!: FormGroup;
  isLoggedIn = false;
  currentUser: User | null = null;
  isOwner = false;
  
  currentImageIndex = 0;
  currentImageUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private proposalService: ProposalService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.exchangeForm = this.formBuilder.group({
      productOfferedId: [null, Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
      this.currentUser = this.authService.getCurrentUser();
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/products']);
      return;
    }
    this.loadProduct(id);
  }

  loadProduct(productId: number): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: product => {
        this.product = product;
        this.isOwner = this.isLoggedIn && this.currentUser?.id === product.user.id;
        this.initImageCarousel();
        if (this.isLoggedIn && !this.isOwner) {
          this.loadUserProducts();
        } else {
          this.isLoading = false;
        }
      },
      error: err => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar produto: ' + err.message, 'Fechar', { duration: 5000 });
        this.router.navigate(['/products']);
      }
    });
  }

  loadUserProducts(): void {
    if (!this.currentUser) return;
    this.productService.getProductsByUser(this.currentUser.id).subscribe({
      next: prods => {
        this.userProducts = prods.filter(p => p.status === 'available');
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar seus produtos: ' + err.message, 'Fechar', { duration: 5000 });
      }
    });
  }

  onContactOwner(): void {
    if (!this.product) return;
    const msg = encodeURIComponent(
      `Olá! Vi seu produto "${this.product.title}" no Trokaí e tenho interesse. Podemos conversar sobre ele?`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  toggleExchangeForm(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/products/${this.product?.id}` } });
      return;
    }
    this.isExchangeFormVisible = !this.isExchangeFormVisible;
    if (this.isExchangeFormVisible && this.userProducts.length) {
      this.selectedProductForExchange = this.userProducts[0].id;
      this.exchangeForm.patchValue({ productOfferedId: this.userProducts[0].id });
    }
  }

  viewUser(id: number): void {
    this.router.navigate([`/profile/${id}`])
  }

  selectProduct(productId: number): void {
    this.selectedProductForExchange = productId;
    this.exchangeForm.patchValue({ productOfferedId: productId });
  }

  submitProposal(): void {
    if (!this.product || this.exchangeForm.invalid) return;
    const { productOfferedId, message } = this.exchangeForm.value;
    this.proposalService.createProposal({ productOfferedId, productRequestedId: this.product.id, message })
      .subscribe({
        next: () => {
          this.snackBar.open('Proposta enviada com sucesso!', 'Fechar', { duration: 3000, panelClass: ['success-snackbar'] });
          this.isExchangeFormVisible = false;
          this.exchangeForm.reset();
        },
        error: err => {
          this.snackBar.open('Erro ao enviar proposta: ' + err.message, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
  }

  initImageCarousel(): void {
    if (!this.product) return;
    if (this.product.images?.length) {
      this.currentImageIndex = 0;
      this.currentImageUrl = this.product.images[0].url;
    } else {
      this.currentImageUrl = '../../../../assets/images/default-product-image.webp';
    }
  }

  nextImage(): void {
    if (!this.product || !this.product.images || this.product.images.length <= 1) return;
    
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    this.currentImageUrl = this.product.images[this.currentImageIndex].url;
  }
  
  // Navegar para a imagem anterior
  prevImage(): void {
    if (!this.product || !this.product.images || this.product.images.length <= 1) return;
    
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.product.images.length - 1 
      : this.currentImageIndex - 1;
    this.currentImageUrl = this.product.images[this.currentImageIndex].url;
  }
  
  // Definir a imagem atual pelo índice
  setCurrentImage(index: number): void {
    if (!this.product || !this.product.images || index >= this.product.images.length) return;
    
    this.currentImageIndex = index;
    this.currentImageUrl = this.product.images[index].url;
  }
}
