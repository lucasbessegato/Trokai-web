import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { ProposalDetailComponent } from './proposal-detail/proposal-detail.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ProposalListComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProposalDetailComponent, canActivate: [AuthGuard] }
];

/**
 * Módulo modificado para usar componentes como importações
 */
@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ProposalListComponent,  // Importando componente standalone 
    ProposalDetailComponent // Importando componente standalone
  ]
})
export class ProposalsModule { }
