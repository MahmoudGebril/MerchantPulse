import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
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

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  login(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
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
