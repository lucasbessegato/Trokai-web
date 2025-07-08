import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpClient: HttpClient) { }

  getNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${environment.apiUrl}/notifications/`);
  }

  markAsRead(notificationId: number): Observable<Notification> {
    return this.httpClient.patch<Notification>(
      `${environment.apiUrl}/notifications/${notificationId}/`,
      { read: true }
    );
  }
}
