import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  unreadNotificationsCount = 0;
  pendingProposalsCount = 0;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private proposalService: ProposalService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadCounts();
      }
    });
  }

  loadCounts(): void {
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadNotificationsCount = count;
    });

    this.proposalService.getPendingProposalsCount().subscribe(count => {
      this.pendingProposalsCount = count;
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
