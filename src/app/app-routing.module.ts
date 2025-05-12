import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) 
  },
  { 
    path: 'proposals', 
    loadChildren: () => import('./features/proposals/proposals.module').then(m => m.ProposalsModule) 
  },
  { 
    path: 'profile/:id', 
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) 
  },
   { 
    path: 'profile', 
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) 
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }