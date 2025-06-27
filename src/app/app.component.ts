import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  notifications = [
    { title: 'Nova proposta recebida', message: 'João enviou uma proposta para o seu item.', read: false },
    { title: 'Proposta aceita', message: 'Sua proposta foi aceita por Maria.', read: true },
    { title: 'Sistema atualizado', message: 'O sistema entrou em modo de manutenção.', read: false },
  ];
  title = 'Trokaí';
  isLoggedIn = false;
  showHeader = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
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

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}