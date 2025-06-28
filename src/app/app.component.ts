import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from './core/services/notification.service';
import { Notification } from './core/models/notification.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  notifications: Notification[] = [];
  title = 'Trokaí';
  isLoggedIn = false;
  showHeader = true;
  unreadCount: number = 0;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;

        if (isLoggedIn) {
          this.getNotifcations();
        } else {
          this.notifications = [];
          this.unreadCount = 0;
        }
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.showHeader = !(url === '/home' || url === '/' || url.includes('/auth')) || this.isLoggedIn;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  getNotifcations() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    })
  }

  markAsRead(notification: Notification){
    this.notificationService.markAsRead(notification.id).subscribe(data=>{
      if(data){
        notification.read = true;
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.router.navigate(['/proposals']);
      }
    })
  }
}