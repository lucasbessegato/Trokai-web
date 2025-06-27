import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Proposal, ProposalStatus, ProposalType } from '../models/proposal.model';
import { proposalsMock, productsMock, usersMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface CreateProposalInput {
  product_offered_id: number;
  product_requested_id: number; 
  to_user_id: number,
  message: string;
}

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
    return this.httpClient.get<Proposal>(`${environment.apiUrl}/proposal/${id}`);
  }

  getUserProposals(type: ProposalType): Observable<Proposal[]> {
    return this.httpClient.get<Proposal[]>(`${environment.apiUrl}/proposal/?tab=${type}`);
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

  createProposal(input: CreateProposalInput): Observable<Proposal> {
    return this.httpClient.post<Proposal>(`${environment.apiUrl}/proposal/`, input);
  }
}
