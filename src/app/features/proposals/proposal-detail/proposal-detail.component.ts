import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from '../../../core/services/auth.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { Proposal, ProposalStatus } from '../../../core/models/proposal.model';

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProposalDetailComponent implements OnInit {
  proposal: Proposal | null = null;
  isLoading = true;
  isCurrentUserSender = false;
  isCurrentUserReceiver = false;

  ProposalStatus = ProposalStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/proposals']);
      return;
    }
    this.loadProposal(id);
  }

  private loadProposal(id: number): void {
    this.isLoading = true;
    this.proposalService.getProposalById(id).subscribe({
      next: p => {
        this.proposal = p;
        const me = this.authService.getCurrentUser();
        if (me && p) {
          this.isCurrentUserSender   = me.id === p.fromUser.id;
          this.isCurrentUserReceiver = me.id === p.toUser.id;
        }
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar proposta: ' + err.message, 'Fechar', { duration: 5000 });
        this.router.navigate(['/proposals']);
      }
    });
  }

  acceptProposal(): void {
    if (!this.proposal || this.proposal.status !== ProposalStatus.PENDING || !this.isCurrentUserReceiver) return;
    this.proposalService.updateProposalStatus(this.proposal.id, ProposalStatus.ACCEPTED)
      .subscribe({
        next: updated => {
          this.proposal = updated;
          this.snackBar.open('Proposta aceita com sucesso!', 'Fechar', { duration: 3000, panelClass: ['success-snackbar'] });
        },
        error: err => {
          this.snackBar.open('Erro ao aceitar proposta: ' + err.message, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
  }

  rejectProposal(): void {
    if (!this.proposal || this.proposal.status !== ProposalStatus.PENDING || !this.isCurrentUserReceiver) return;
    this.proposalService.updateProposalStatus(this.proposal.id, ProposalStatus.REJECTED)
      .subscribe({
        next: updated => {
          this.proposal = updated;
          this.snackBar.open('Proposta recusada.', 'Fechar', { duration: 3000 });
        },
        error: err => {
          this.snackBar.open('Erro ao recusar proposta: ' + err.message, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
  }

  completeExchange(): void {
    if (!this.proposal || this.proposal.status !== ProposalStatus.ACCEPTED || !this.isCurrentUserReceiver) return;
    this.proposalService.updateProposalStatus(this.proposal.id, ProposalStatus.COMPLETED)
      .subscribe({
        next: updated => {
          this.proposal = updated;
          this.snackBar.open('Troca concluída com sucesso!', 'Fechar', { duration: 3000, panelClass: ['success-snackbar'] });
        },
        error: err => {
          this.snackBar.open('Erro ao concluir troca: ' + err.message, 'Fechar', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
  }

  contactViaWhatsApp(): void {
    if (!this.proposal) return;
    const rec = this.isCurrentUserSender
      ? this.proposal.toUser.fullName
      : this.proposal.fromUser.fullName;
    const offered   = this.proposal.productOffered.title;
    const requested = this.proposal.productRequested.title;
    const msg = encodeURIComponent(
      `Olá ${rec}! Estou falando sobre a proposta de trocar ${offered} por ${requested} no Trokaí.`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  getStatusText(s: ProposalStatus): string {
    switch (s) {
      case ProposalStatus.PENDING:   return 'Pendente';
      case ProposalStatus.ACCEPTED:  return 'Aceita';
      case ProposalStatus.REJECTED:  return 'Recusada';
      case ProposalStatus.COMPLETED: return 'Concluída';
      case ProposalStatus.CANCELED:  return 'Cancelada';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(s: ProposalStatus): string {
    switch (s) {
      case ProposalStatus.PENDING:   return 'status-pending';
      case ProposalStatus.ACCEPTED:  return 'status-accepted';
      case ProposalStatus.REJECTED:  return 'status-rejected';
      case ProposalStatus.COMPLETED: return 'status-completed';
      case ProposalStatus.CANCELED:  return 'status-canceled';
      default: return '';
    }
  }
}
