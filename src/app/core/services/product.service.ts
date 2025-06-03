import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, Category, ProductStatus, ProductImage } from '../models/product.model';
import { productsMock } from '../mock-data/mocks';
import { categoriesMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = productsMock;
  private categories: Category[] = categoriesMock;

  constructor(private authService: AuthService, private http: HttpClient) { }

  getAllProducts(filters?: any): Observable<Product[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    let params = new HttpParams();
    if (filters?.category != null) {
      params = params.set('category', filters.category.toString());
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/`,
      { headers, params }
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category.id === categoryId);
    return of(filtered).pipe(delay(500));
  }

  getProductById(id: number): Observable<Product> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.get<Product>(
      `${environment.apiUrl}/products/${id}/`,
      { headers }
    );
  }

  getProductsByUser(userId: number): Observable<Product[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    let params = new HttpParams();
    if (userId) {
      params = params.set('user', userId);
    }

    return this.http.get<Product[]>(
      `${environment.apiUrl}/products/`,
      { headers, params }
    );
  }

  getAllCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(300));
  }

  createProduct(productData: any): Observable<Product> {
    const newProduct = {
      title: productData.title ?? '',
      description: productData.description ?? '',
      category: productData.category ?? this.categories[0].id,
      acceptable_exchanges: productData.acceptableExchanges ?? [],
      status: ProductStatus.AVAILABLE,
    };

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.post<Product>(
      `${environment.apiUrl}/products/`,
      newProduct,
      { headers }
    );
  }

  uploadProductImage(productId: number, form: FormData): Observable<ProductImage> {
    const token = this.authService.getToken();
    return this.http.post<ProductImage>(
      `${environment.apiUrl}/products/${productId}/images/`,
      form,
      {
        headers: new HttpHeaders({
          Authorization: `Token ${token}`
        })
      }
    );
  }



  updateProductStatus(productId: number, status: ProductStatus): Observable<Product> {
    const idx = this.products.findIndex(p => p.id === productId);
    if (idx === -1) {
      return throwError(() => new Error('Produto não encontrado'));
    }

    this.products[idx] = {
      ...this.products[idx],
      status,
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
