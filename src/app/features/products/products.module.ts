import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'create', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  declarations: [
    // Os componentes standalone não precisam ser declarados
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProductListComponent, // Importar o componente standalone ao invés de declará-lo
    ProductDetailComponent, // Importando o componente ProductDetailComponent
    ProductCreateComponent // Importando o componente ProductCreateComponent
  ]
})
export class ProductsModule { }
