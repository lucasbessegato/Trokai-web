import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { Proposal, ProposalStatus } from '../../../core/models/proposal.model';
import { ProposalService } from '../../../core/services/proposal.service';
import { ProductImagePipe } from 'src/app/shared/pipes/product-image.pipe';
import { UserImagePipe } from 'src/app/shared/pipes/user-image.pipe';
import { delay, forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    ProductImagePipe,
    UserImagePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Permite uso de elementos desconhecidos no template
})
export class ProposalListComponent implements OnInit {
  receivedProposals: Proposal[] = [];
  sentProposals: Proposal[] = [];
  activeTab = 0;
  isLoadingReceived = true;
  isLoadingSent = true;
  
  ProposalStatus = ProposalStatus;
  
  constructor(
    private proposalService: ProposalService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadReceivedProposals();
    this.loadSentProposals();
  }
  
  loadReceivedProposals(): void {
    this.isLoadingReceived = true;
    this.proposalService.getUserProposals('recebidas').subscribe({
      next: (proposals) => {
        this.receivedProposals = proposals;
        this.isLoadingReceived = false;
      },
      error: (error) => {
        this.isLoadingReceived = false;
        this.snackBar.open('Erro ao carregar propostas recebidas: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  loadSentProposals(): void {
    this.isLoadingSent = true;
    this.proposalService.getUserProposals('enviadas').subscribe({
      next: (proposals) => {
        this.sentProposals = proposals;
        this.isLoadingSent = false;
      },
      error: (error) => {
        this.isLoadingSent = false;
        this.snackBar.open('Erro ao carregar propostas enviadas: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  viewProductFromSendProposal(proposal: Proposal) {
     this.router.navigate(['/products', proposal.product_requested.id]);
  }

  viewProductFromReceivedProposal(proposal: Proposal) {
     this.router.navigate(['/products', proposal.product_offered.id]);
  }
  
  getStatusClass(status: ProposalStatus): string {
    switch (status) {
      case ProposalStatus.PENDING:
        return 'status-pending';
      case ProposalStatus.ACCEPTED:
        return 'status-accepted';
      case ProposalStatus.REJECTED:
        return 'status-rejected';
      case ProposalStatus.COMPLETED:
        return 'status-completed';
      case ProposalStatus.CANCELED:
        return 'status-canceled';
      default:
        return '';
    }
  }
  
  getStatusText(status: ProposalStatus): string {
    switch (status) {
      case ProposalStatus.PENDING:
        return 'Pendente';
      case ProposalStatus.ACCEPTED:
        return 'Aceita';
      case ProposalStatus.REJECTED:
        return 'Recusada';
      case ProposalStatus.COMPLETED:
        return 'Concluída';
      case ProposalStatus.CANCELED:
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  }
  
  acceptProposal(proposal: Proposal): void {    
    if (proposal.status !== ProposalStatus.PENDING) return;
    
    this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.ACCEPTED).subscribe({
      next: () => {
        this.snackBar.open('Proposta aceita com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadReceivedProposals();
      },
      error: (error) => {
        this.snackBar.open('Erro ao aceitar proposta: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  rejectProposal(proposal: Proposal): void {    
    if (proposal.status !== ProposalStatus.PENDING) return;
    
    this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.REJECTED).subscribe({
      next: () => {
        this.snackBar.open('Proposta recusada.', 'Fechar', {
          duration: 3000
        });
        this.loadReceivedProposals();
      },
      error: (error) => {
        this.snackBar.open('Erro ao recusar proposta: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  completeExchange(proposal: Proposal): void {    
    if (proposal.status !== ProposalStatus.ACCEPTED) return;
    
    this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.COMPLETED).subscribe({
      next: () => {
        this.snackBar.open('Troca concluída com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadSentProposals();
      },
      error: (error) => {
        this.snackBar.open('Erro ao concluir troca: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteProposal(proposal: Proposal): void {
    this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.CANCELED).pipe(
      delay(1000),
      switchMap(() => this.proposalService.deleteProposal(proposal.id))
    ).subscribe({
      next: () => {
        this.snackBar.open('Proposta excluída com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadSentProposals();
      },
      error: (error) => {
        this.snackBar.open('Erro ao excluir proposta: ' + error.message, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  tabChanged(index: number): void {
    this.activeTab = index;
  }
}
