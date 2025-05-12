import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Proposal, ProposalStatus } from '../models/proposal.model';
import { proposalsMock, productsMock, usersMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private proposals: Proposal[] = proposalsMock;

  constructor(private authService: AuthService) {}

  getPendingProposalsCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const count = this.proposals.filter(
      p => p.toUser.id === currentUser.id && p.status === ProposalStatus.PENDING
    ).length;
    return of(count).pipe(delay(200));
  }

  getProposalById(id: number): Observable<Proposal> {
    const proposal = this.proposals.find(p => p.id === id);
    if (!proposal) {
      return throwError(() => new Error('Proposta não encontrada'));
    }
    return of(proposal).pipe(delay(500));
  }

  getUserReceivedProposals(): Observable<Proposal[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const received = this.proposals.filter(p => p.toUser.id === currentUser.id);
    return of(received).pipe(delay(500));
  }

  getUserSentProposals(): Observable<Proposal[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const sent = this.proposals.filter(p => p.fromUser.id === currentUser.id);
    return of(sent).pipe(delay(500));
  }

  updateProposalStatus(proposalId: number, status: ProposalStatus): Observable<Proposal> {
    const idx = this.proposals.findIndex(p => p.id === proposalId);
    if (idx === -1) {
      return throwError(() => new Error('Proposta não encontrada'));
    }
    this.proposals[idx] = {
      ...this.proposals[idx],
      status,
      updatedAt: new Date()
    };
    return of(this.proposals[idx]).pipe(delay(700));
  }

  createProposal(data: {
    productOfferedId: number;
    productRequestedId: number;
    message: string;
  }): Observable<Proposal> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const offered = productsMock.find(p => p.id === data.productOfferedId)!;
    const requested = productsMock.find(p => p.id === data.productRequestedId)!;
    const toUser = requested.user;
    const newProposal: Proposal = {
      id: this.proposals.length + 1,
      productOffered: offered,
      productRequested: requested,
      fromUser: currentUser,
      toUser,
      message: data.message,
      status: ProposalStatus.PENDING,
      created_at: new Date(),
      updatedAt: new Date()
    };
    this.proposals.push(newProposal);
    return of(newProposal).pipe(delay(800));
  }
}
