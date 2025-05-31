import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { ReputationBadgeComponent } from '../reputation-badge/reputation-badge.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReputationBadgeComponent,
    SharedModule,
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions = true;
  @Output() proposeExchange = new EventEmitter<Product>();
  @Output() contactOwner = new EventEmitter<Product>();
  
  isLoggedIn = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  
  onProposeExchange(): void {
    if (this.isLoggedIn) {
      this.proposeExchange.emit(this.product);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/products/${this.product.id}` }
      });
    }
  }
  
  onContactOwner(): void {
    this.contactOwner.emit(this.product);
  }
  
  navigateToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}
