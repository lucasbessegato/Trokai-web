import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

export interface RateUserInput {
  from_user: number;
  to_user: number; 
  comment: string,
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private httpClient: HttpClient) {}

  rateUser(input: RateUserInput): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiUrl}/rating/`, input);
  }
}
