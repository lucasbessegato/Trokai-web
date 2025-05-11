import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }    from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  // declarations fica vazio quando todos os componentes são standalone
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoginComponent,
    RegisterComponent,
  ]
})
export class AuthModule { }
