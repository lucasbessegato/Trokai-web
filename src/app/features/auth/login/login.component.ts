import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/products']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.loginError = '';
    
    const { username, password } = this.loginForm.value;
    
    // Usando o authService para fazer login
    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.authService.currentUserSubject.next(response.user)
         this.authService.isLoggedInSubject.next(true)
        this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
          duration: 3000
        });
        this.router.navigate(['/products']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loginError = 'Erro ao fazer login. Verifique suas credenciais e tente novamente.';
        this.snackBar.open(this.loginError, 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}