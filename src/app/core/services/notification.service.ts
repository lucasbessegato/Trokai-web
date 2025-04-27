import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification, NotificationType } from '../models/notification.model';
import { notificationsMock, usersMock } from '../mock-data/mocks';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = notificationsMock;

  constructor(private authService: AuthService) {}

  getNotifications(): Observable<Notification[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const userNotifications = this.notifications
      .filter(n => n.user.id === currentUser.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return of(userNotifications).pipe(delay(300));
  }

  getUnreadCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const count = this.notifications
      .filter(n => n.user.id === currentUser.id && !n.read)
      .length;
    return of(count).pipe(delay(200));
  }

  markAsRead(notificationId: number): Observable<Notification> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const idx = this.notifications.findIndex(
      n => n.id === notificationId && n.user.id === currentUser.id
    );
    if (idx === -1) {
      return throwError(() => new Error('Notificação não encontrada'));
    }
    this.notifications[idx].read = true;
    return of(this.notifications[idx]).pipe(delay(200));
  }

  markAllAsRead(): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    this.notifications.forEach(n => {
      if (n.user.id === currentUser.id) {
        n.read = true;
      }
    });
    return of(true).pipe(delay(300));
  }

  createNotification(data: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: number;
    linkTo?: string;
  }): Observable<Notification> {
    const user = usersMock.find(u => u.id === data.userId);
    if (!user) {
      return throwError(() => new Error('Usuário não encontrado'));
    }
    const newNotification: Notification = {
      id: this.notifications.length + 1,
      user,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      createdAt: new Date(),
      relatedId: data.relatedId,
      linkTo: data.linkTo
    };
    this.notifications.push(newNotification);
    return of(newNotification).pipe(delay(300));
  }

  deleteNotification(notificationId: number): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuário não autenticado'));
    }
    const idx = this.notifications.findIndex(
      n => n.id === notificationId && n.user.id === currentUser.id
    );
    if (idx === -1) {
      return throwError(() => new Error('Notificação não encontrada'));
    }
    this.notifications.splice(idx, 1);
    return of(true).pipe(delay(200));
  }
}
