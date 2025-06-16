import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Proposal, ProposalStatus, ProposalType } from '../models/proposal.model';
import { proposalsMock, productsMock, usersMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private proposals: Proposal[] = proposalsMock;

  constructor(private authService: AuthService, private httpClient: HttpClient) {}

  getPendingProposalsCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const count = this.proposals.filter(
      p => p.to_user.id === currentUser.id && p.status === ProposalStatus.PENDING
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

  getUserProposals(type: ProposalType): Observable<Proposal[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.httpClient.get<Proposal[]>(`${environment.apiUrl}/proposal/?tab=${type}`, { headers });
  }

  updateProposalStatus(proposalId: number, status: ProposalStatus): Observable<Proposal> {
    const idx = this.proposals.findIndex(p => p.id === proposalId);
    if (idx === -1) {
      return throwError(() => new Error('Proposta não encontrada'));
    }
    this.proposals[idx] = {
      ...this.proposals[idx],
      status,
      updated_at: new Date()
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
      product_offered: offered,
      product_requested: requested,
      from_user: currentUser,
      to_user: toUser,
      message: data.message,
      status: ProposalStatus.PENDING,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.proposals.push(newProposal);
    return of(newProposal).pipe(delay(800));
  }
}
