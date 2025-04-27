import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserRating } from '../models/user.model';
import { usersMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = usersMock;
  private ratings: UserRating[] = [];

  constructor(private authService: AuthService) {}

  getUserById(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return throwError(() => new Error('Usuário não encontrado'));
    }
    return of(user).pipe(delay(300));
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const idx = this.users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) {
      return throwError(() => new Error('Usuário não encontrado'));
    }

    const updatedUser: User = {
      ...this.users[idx],
      ...userData
    };
    this.users[idx] = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return of(updatedUser).pipe(delay(500));
  }

  rateUser(userId: number, rating: number, comment: string): Observable<UserRating> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const targetUser = this.users.find(u => u.id === userId);
    if (!targetUser) {
      return throwError(() => new Error('Usuário a ser avaliado não encontrado'));
    }

    const newRating: UserRating = {
      id: this.ratings.length + 1,
      fromUser: currentUser,
      toUser: targetUser,
      rating,
      comment,
      createdAt: new Date()
    };
    this.ratings.push(newRating);

    // recalcula reputação
    const userRatings = this.ratings.filter(r => r.toUser.id === userId);
    const totalScore = userRatings.reduce((acc, r) => acc + r.rating, 0);
    const averageScore = totalScore / userRatings.length;
    const userIdx = this.users.findIndex(u => u.id === userId);
    this.users[userIdx].reputationScore = Math.round(averageScore * 10) / 10;

    if (userRatings.length >= 10 && averageScore >= 4.5) {
      this.users[userIdx].reputationLevel = 4; // Mestre
    } else if (userRatings.length >= 5 && averageScore >= 4) {
      this.users[userIdx].reputationLevel = 3; // Expert
    } else if (userRatings.length >= 3 && averageScore >= 3) {
      this.users[userIdx].reputationLevel = 2; // Intermediário
    } else {
      this.users[userIdx].reputationLevel = 1; // Iniciante
    }

    return of(newRating).pipe(delay(500));
  }

  getUserRatings(userId: number): Observable<UserRating[]> {
    const userRatings = this.ratings.filter(r => r.toUser.id === userId);
    return of(userRatings).pipe(delay(300));
  }

  getReputationBadgeInfo(level: number): { title: string; imageUrl: string; description: string } {
    switch (level) {
      case 4:
        return {
          title: 'Mestre Trocador',
          imageUrl: 'https://images.unsplash.com/photo-1530489084005-e761a76747f5',
          description: 'Usuário com mais de 10 avaliações e nota média acima de 4.5'
        };
      case 3:
        return {
          title: 'Especialista',
          imageUrl: 'https://images.unsplash.com/photo-1517353334933-3365be5c8ec3',
          description: 'Usuário com mais de 5 avaliações e nota média acima de 4.0'
        };
      case 2:
        return {
          title: 'Intermediário',
          imageUrl: 'https://images.unsplash.com/photo-1503754316622-24a587c4b4a1',
          description: 'Usuário com mais de 3 avaliações e nota média acima de 3.0'
        };
      case 1:
      default:
        return {
          title: 'Iniciante',
          imageUrl: 'https://images.unsplash.com/photo-1520944227593-49dc56484401',
          description: 'Novo usuário na plataforma'
        };
    }
  }
}
