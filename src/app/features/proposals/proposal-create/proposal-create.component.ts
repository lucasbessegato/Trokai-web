import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ReputationBadgeComponent } from 'src/app/shared/components/reputation-badge/reputation-badge.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';
import { ProposalService } from '../../../core/services/proposal.service';

@Component({
  selector: 'app-proposal-create',
  templateUrl: './proposal-create.component.html',
  styleUrls: ['./proposal-create.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    ReputationBadgeComponent,
  ]
})
export class ProposalCreateComponent implements OnInit {
  proposalForm!: FormGroup;
  productRequested: Product | null = null;
  userProducts: Product[] = [];
  selectedProductForExchange: number | null = null;
  isLoading = true;
  isSubmitting = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private proposalService: ProposalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadRequestedProduct();
  }
  
  initForm(): void {
    this.proposalForm = this.formBuilder.group({
      productOfferedId: [null, Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }
  
  loadRequestedProduct(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(productId)) {
      this.router.navigate(['/products']);
      return;
    }
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.productRequested = product;
        
        const currentUser = this.authService.getCurrentUser();
        
        if (currentUser && product.user.id === currentUser.id) {
          this.snackBar.open('Você não pode propor troca para seu próprio produto', 'Fechar', {
            duration: 5000
          });
          this.router.navigate(['/products', productId]);
          return;
        }
        
        this.loadUserProducts();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar produto: ' + error.message, 'Fechar', {
          duration: 5000
        });
        this.router.navigate(['/products']);
      }
    });
  }
  
  loadUserProducts(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    
    this.productService.getProductsByUser(currentUser.id).subscribe({
      next: (products) => {
        // Filter only available products
        this.userProducts = products.filter(p => p.status === 'available');
        
        if (this.userProducts.length > 0) {
          this.selectedProductForExchange = this.userProducts[0].id;
          this.proposalForm.patchValue({
            productOfferedId: this.userProducts[0].id
          });
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar seus produtos: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  selectProduct(productId: number): void {
    this.selectedProductForExchange = productId;
    this.proposalForm.patchValue({
      productOfferedId: productId
    });
  }
  
  onSubmit(): void {
    if (this.proposalForm.invalid || !this.productRequested || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    const formValue = this.proposalForm.value;
    
    this.proposalService.createProposal({
      productOfferedId: formValue.productOfferedId,
      productRequestedId: this.productRequested.id,
      message: formValue.message
    }).subscribe({
      next: (proposal) => {
        this.isSubmitting = false;
        this.snackBar.open('Proposta enviada com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/proposals', proposal.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open('Erro ao enviar proposta: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
