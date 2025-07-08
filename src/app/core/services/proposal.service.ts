import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proposal, ProposalStatus, ProposalType } from '../models/proposal.model';

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
  constructor(private httpClient: HttpClient) {}

  getProposalById(id: number): Observable<Proposal> {
    return this.httpClient.get<Proposal>(`${environment.apiUrl}/proposal/${id}`);
  }

  getUserProposals(type: ProposalType): Observable<Proposal[]> {
    return this.httpClient.get<Proposal[]>(`${environment.apiUrl}/proposal/?tab=${type}`);
  }

  updateProposalStatus(proposalId: number, status: ProposalStatus): Observable<Proposal> {
    return this.httpClient.patch<Proposal>(`${environment.apiUrl}/proposal/${proposalId}/`, { status });
  }

  createProposal(input: CreateProposalInput): Observable<Proposal> {
    return this.httpClient.post<Proposal>(`${environment.apiUrl}/proposal/`, input);
  }

  deleteProposal(proposalId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/proposal/${proposalId}/`);
  }
}
