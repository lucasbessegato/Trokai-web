import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, Category, ProductStatus } from '../models/product.model';
import { productsMock } from '../mock-data/mocks';
import { categoriesMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = productsMock;
  private categories: Category[] = categoriesMock;

  constructor(private authService: AuthService) {}

  getAllProducts(): Observable<Product[]> {
    return of(this.products).pipe(delay(500));
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category.id === categoryId);
    return of(filtered).pipe(delay(500));
  }

  getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return product
      ? of(product).pipe(delay(300))
      : throwError(() => new Error('Produto não encontrado'));
  }

  getProductsByUser(userId: number): Observable<Product[]> {
    const userProducts = this.products.filter(p => p.user.id === userId);
    return of(userProducts).pipe(delay(300));
  }

  getAllCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(300));
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const newProduct: Product = {
      id: this.products.length + 1,
      title: productData.title ?? '',
      description: productData.description ?? '',
      imageUrl: productData.imageUrl ?? '',
      images: productData.images ?? [],
      category: productData.category ?? this.categories[0],
      user: currentUser,
      acceptableExchanges: productData.acceptableExchanges ?? [],
      status: ProductStatus.AVAILABLE,
      created_at: new Date(),
      updatedAt: new Date()
    };

    this.products.push(newProduct);
    return of(newProduct).pipe(delay(800));
  }

  updateProductStatus(productId: number, status: ProductStatus): Observable<Product> {
    const idx = this.products.findIndex(p => p.id === productId);
    if (idx === -1) {
      return throwError(() => new Error('Produto não encontrado'));
    }

    this.products[idx] = {
      ...this.products[idx],
      status,
      updatedAt: new Date()
    };

    return of(this.products[idx]).pipe(delay(300));
  }

  searchProducts(query: string): Observable<Product[]> {
    const q = query.toLowerCase().trim();
    const results = this.products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
    return of(results).pipe(delay(300));
  }
}
