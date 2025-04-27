import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    console.log('Home component initialized');
  }

  onGetStarted(): void {
    console.log('Get Started button clicked');
    // Direciona para a página de login
    this.router.navigate(['/auth/login']);
  }
}