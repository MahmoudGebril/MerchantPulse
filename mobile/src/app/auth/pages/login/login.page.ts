import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../../theme/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonSpinner,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  login(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data.user.store) {
          this.theme.applyStoreBrand({
            name: data.user.store.name,
            brandPrimaryColor: data.user.store.brandPrimaryColor,
            brandLogoUrl: data.user.store.brandLogoUrl,
          });
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Login failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
