import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductImage, ProductStatus } from '../../../core/models/product.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];

  isLoading = true;
  error: string | null = null;
  productStatus = ProductStatus;

  searchText: string = '';
  selectedCategory: string = '';
  selectedCondition: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products.filter(p => p.status === ProductStatus.AVAILABLE);
        this.filteredProducts = [...this.allProducts];
        this.products = [...this.filteredProducts];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar produtos. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  async applyFilters(): Promise<void> {
    let filters = {
      category: this.selectedCategory || '',
      search: this.searchText || ''
    }
    this.productService.getAllProducts(filters).subscribe(data => {
      this.products = data
    })
  }

  getMainImageUrl(images: ProductImage[] | undefined): string {
    if (!images || images.length === 0) {
      return ''; // ou algum placeholder fixo
    }
    const mainImg = images.find(img => img.is_main);
    return mainImg ? mainImg.url : images[0].url;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.selectedCondition = '';
    this.filteredProducts = [...this.allProducts];
    this.products = [...this.filteredProducts];
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
}
