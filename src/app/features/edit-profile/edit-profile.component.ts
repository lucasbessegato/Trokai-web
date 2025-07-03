import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService, Cidade, Estado } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-edit-profile-modal',
    standalone: true,
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        NgxMaskDirective,
    ],
    providers: [
        provideNgxMask()  // <-- adicione isso aqui
    ],
})
export class EditProfileModalComponent implements OnInit {
    registerForm!: FormGroup;
    isLoading = false;
    hidePassword = true;
    selectedFile: File | null = null;
    previewUrl: string | ArrayBuffer | null = null;
    estados: Estado[] = [];
    cidades: Cidade[] = [];
    currentUser: any;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<EditProfileModalComponent>
    ) { }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            username: ['', [Validators.required, Validators.minLength(3)]],
            phone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            estado: [null, [Validators.required]],
            cidade: [null, [Validators.required]],
        });

        this.authService.getEstados().subscribe(est => {
            this.estados = est;

            this.currentUser = this.authService.getCurrentUser();
            if (this.currentUser) {
                const estadoObj = this.estados.find(e => e.nome === this.currentUser.state);
                this.registerForm.patchValue({
                    fullName: this.currentUser.fullName,
                    username: this.currentUser.username,
                    phone: this.currentUser.phone,
                    email: this.currentUser.email,
                    estado: estadoObj,
                    cidade: { nome: this.currentUser.city }
                });
                this.previewUrl = this.currentUser.avatar;

                // Agora carrega as cidades após o estado estar setado
                if (estadoObj) {
                    this.authService.getCidades(estadoObj.id).subscribe(cidades => {
                        this.cidades = cidades;

                        const cidadeObj = cidades.find(c => c.nome === this.currentUser.city);
                        if (cidadeObj) {
                            this.registerForm.get('cidade')?.setValue(cidadeObj);
                        }
                    });
                }
            }
        });
    }

    onEstadoChange(estado: Estado) {
        this.cidades = [];
        this.registerForm.get('cidade')?.reset();
        if (estado) {
            this.authService.getCidades(estado.id).subscribe(c => this.cidades = c);
        }
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

    passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            form.get('confirmPassword')?.setErrors({ mismatch: true });
            return { mismatch: true };
        }
        return null;
    }

    onSubmit(): void {
        if (this.registerForm.invalid || this.isLoading) return;

        this.isLoading = true;
        const f = this.registerForm.value;

        const fd = new FormData();
        fd.append('fullName', f.fullName);
        fd.append('username', f.username);
        fd.append('email', f.email);
        //fd.append('password', f.password);
        fd.append('phone', f.phone);
        fd.append('state', f.estado.nome);
        fd.append('city', f.cidade.nome);
        if (this.selectedFile) {
            fd.append('avatar_file', this.selectedFile, this.selectedFile.name);
        }

        this.authService.updateUser(fd, this.currentUser.id).subscribe({
            next: (user) => {
                this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.authService.currentUserSubject.next(user)
                this.dialogRef.close(true);
            },
            error: err => {
                this.isLoading = false;
                this.snackBar.open(err.message || 'Erro ao atualizar perfil.', 'Fechar', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }
}
