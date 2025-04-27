import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: UserProfileComponent, canActivate: [AuthGuard] }
];

/**
 * Módulo modificado para usar UserProfileComponent como importação
 */
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    UserProfileComponent // Importando componente standalone ao invés de declarar
  ]
})
export class ProfileModule { }
