import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToggle,
} from '@ionic/angular/standalone';
import { ThemeService } from '../../../theme/services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonToggle,
  ],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage {
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;
  readonly darkMode = this.theme.darkMode;

  logout(): void {
    this.auth.logout();
  }

  onDarkModeChange(ev: Event): void {
    const checked = (ev as CustomEvent).detail.checked;
    this.theme.setTheme({ darkMode: checked });
  }
}
