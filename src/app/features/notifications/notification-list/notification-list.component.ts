import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Notification, NotificationType } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading = true;
  
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadNotifications();
  }
  
  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar notificações: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  markAllAsRead(): void {
    if (this.notifications.length === 0) return;
    
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        this.snackBar.open('Todas as notificações foram marcadas como lidas', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao marcar notificações como lidas: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  markAsRead(notification: Notification, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (notification.read) return;
    
    this.notificationService.markAsRead(notification.id).subscribe({
      next: (updatedNotification) => {
        const index = this.notifications.findIndex(n => n.id === notification.id);
        if (index !== -1) {
          this.notifications[index] = updatedNotification;
        }
      },
      error: (error) => {
        this.snackBar.open('Erro ao marcar notificação como lida: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.snackBar.open('Notificação removida', 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao remover notificação: ' + error.message, 'Fechar', {
          duration: 5000
        });
      }
    });
  }
  
  navigateToLink(notification: Notification): void {
    // Mark as read when clicked
    this.markAsRead(notification);
    
    // Navigate to the specified link if available
    if (notification.link_to) {
      this.router.navigateByUrl(notification.link_to);
    }
  }
  
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.NEW_PROPOSAL:
        return 'swap_horiz';
      case NotificationType.PROPOSAL_ACCEPTED:
        return 'check_circle';
      case NotificationType.PROPOSAL_REJECTED:
        return 'cancel';
      case NotificationType.EXCHANGE_COMPLETED:
        return 'done_all';
      case NotificationType.NEW_RATING:
        return 'star';
      case NotificationType.LEVEL_UP:
        return 'trending_up';
      case NotificationType.SYSTEM:
      default:
        return 'notifications';
    }
  }
  
  getNotificationClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.NEW_PROPOSAL:
        return 'new-proposal';
      case NotificationType.PROPOSAL_ACCEPTED:
        return 'proposal-accepted';
      case NotificationType.PROPOSAL_REJECTED:
        return 'proposal-rejected';
      case NotificationType.EXCHANGE_COMPLETED:
        return 'exchange-completed';
      case NotificationType.NEW_RATING:
        return 'new-rating';
      case NotificationType.LEVEL_UP:
        return 'level-up';
      case NotificationType.SYSTEM:
      default:
        return 'system';
    }
  }
}
