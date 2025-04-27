import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'Trokaí';
  isLoggedIn = false;
  showHeader = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    console.log('Application initialized');
    
    // Verificar estado de autenticação
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    
    // Monitorar mudanças de rota para controlar a exibição do header
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Não mostrar o header na página inicial e de autenticação quando não estiver logado
      const url = event.url;
      this.showHeader = !(url === '/home' || url === '/' || url.includes('/auth')) || this.isLoggedIn;
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}