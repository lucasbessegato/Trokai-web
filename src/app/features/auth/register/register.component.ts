import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService, Cidade, Estado } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  providers: [
    provideNgxMask()
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      estado: [null, [Validators.required]],
      cidade: [null, [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });

    this.authService.getEstados().subscribe(est => this.estados = est);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onEstadoChange(estado: Estado) {
    this.cidades = [];
    this.registerForm.get('cidade')?.reset();
    if (estado) {
      this.authService.getCidades(estado.id)
        .subscribe(c => this.cidades = c);
    }
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

    const fd = new FormData();
    const f = this.registerForm.value;
    fd.append('fullName', f.fullName);
    fd.append('username', f.username);
    fd.append('email', f.email);
    fd.append('password', f.password);
    fd.append('phone', f.phone);
    fd.append('state', f.estado.nome);
    fd.append('city', f.cidade.nome);
    if (this.selectedFile) {
      fd.append('avatar_file', this.selectedFile, this.selectedFile.name);
    }

    this.authService
      .register(fd)
      .subscribe({
        next: user => {
          this.router.navigate(['/auth/login']);
          this.snackBar.open('Cadastro realizado com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
        },
        error: err => {
          this.isLoading = false;
          this.snackBar.open(err.message || 'Falha ao criar conta. Tente novamente.', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
