import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Pipe({
  name: 'productImage',
  standalone: true
})
export class ProductImagePipe implements PipeTransform {
  transform(product: Product): string {
    if (product.images && product.images.length) {
      const mainImage = product.images.find(image => image.is_main);
      return mainImage?.url || product.images[0].url;
    }

    return '../../../assets/images/default-product-image.webp';
  }
}
