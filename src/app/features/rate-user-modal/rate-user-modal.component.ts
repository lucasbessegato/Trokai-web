import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReputationBadgeComponent } from 'src/app/shared/components/reputation-badge/reputation-badge.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { RateUserInput, RatingService } from 'src/app/core/services/rating.service';
import { finalize } from 'rxjs';

export interface RateUserDialogData {
  toUser: User;
}


@Component({
  selector: 'app-rate-user-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReputationBadgeComponent
  ],
  standalone: true,
  templateUrl: './rate-user-modal.component.html',
  styleUrl: './rate-user-modal.component.scss'
})
export class RateUserModalComponent {

  rateForm: FormGroup;
  isLoading: boolean = false;

  currentUser: User | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ratingService: RatingService,
    private dialogRef: MatDialogRef<RateUserModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dialogData: RateUserDialogData,
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.rateForm = this.fb.group({
      rating: [0, [Validators.required]],
      comment: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.rateForm.invalid) {
      this.rateForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const input: RateUserInput = {
      from_user: this.currentUser!,
      to_user: this.dialogData.toUser,
      comment: this.rateForm.value.comment,
      rating: this.rateForm.value.rating
    };
    this.ratingService.rateUser(input)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Avaliação enviada com sucesso!', 'Fechar', {
            duration: 5000,
              panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.message || 'Erro ao enviar avaliação.', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
        }
      });
  }
}
