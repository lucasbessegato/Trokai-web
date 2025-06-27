import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductImage } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { ReputationBadgeComponent } from '../reputation-badge/reputation-badge.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ProductImagePipe } from '../../pipes/product-image.pipe';
import { UserImagePipe } from '../../pipes/user-image.pipe';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReputationBadgeComponent,
    SharedModule,
    ProductImagePipe,
    UserImagePipe,
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions = true;
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<number>();
  
  isLoggedIn = false;
  currentUserId?: number;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.currentUserId = this.authService.getCurrentUser()?.id;
  }
  
  navigateToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  contactOwner(): void {
    if (!this.product) return;
    const msg = encodeURIComponent(
      `Olá! Vi seu produto "${this.product.title}" no Trokaí e tenho interesse. Podemos conversar sobre ele?`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
}
