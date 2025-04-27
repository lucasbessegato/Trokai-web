import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9_-]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    
    const { fullName, username, email, password } = this.registerForm.value;
    
    this.authService.register({
      fullName,
      username,
      email,
      password
    }).subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Falha ao criar conta. Tente novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
