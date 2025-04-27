import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

// Vamos usar apenas o componente LoginComponent por enquanto
// pois o componente RegisterComponent ainda não foi atualizado como standalone

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent }
];

@NgModule({
  declarations: [
    // Os componentes standalone não precisam ser declarados
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoginComponent // Importar o componente standalone ao invés de declará-lo
  ]
})
export class AuthModule { }
